import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// โหลด environment variables จากไฟล์ .env
dotenv.config();

// สร้าง Prisma client
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

// ตรวจสอบว่ามีการกำหนด SECRET_KEY หรือไม่
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables.');
}

// ประเภทของ ActiveToken สำหรับจัดการ token
interface ActiveToken {
    userId: number;
    expiresAt: Date;
}

// ตัวแปรสำหรับเก็บ token ที่ใช้งานอยู่ (ใช้ในหน่วยความจำในตัวอย่างนี้)
let activeTokens: Record<string, ActiveToken> = {};

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่
export const createUser = async (data: Prisma.UserCreateInput) => {
    try {
        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(data.password, 10); // 10 คือค่า salt rounds

        // สร้างผู้ใช้ใหม่ในฐานข้อมูล
        const newUser = await prisma.user.create({
            select: { id: true, username: true }, // แก้ไขจาก select{ id:true, username:true} เป็น select: { id: true, username: true }
            data: {
                ...data, // ใช้ข้อมูลที่ส่งเข้ามา
                password: hashedPassword, // ใช้รหัสผ่านที่เข้ารหัส
            },
        });

        return newUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("Username already exists."); // ถ้ามีชื่อผู้ใช้ซ้ำ
            }
        }
        throw new Error(`Failed to create user: ${(error as Error).message}`); // ข้อผิดพลาดอื่น ๆ
    }
};
// ฟังก์ชันสำหรับออกจากระบบ
export const logoutUser = (token: string) => {
    delete activeTokens[token]; // ลบ token ออกจาก activeTokens
};

// ฟังก์ชันเพื่อตรวจสอบสถานะ token ว่ายังใช้งานได้อยู่หรือไม่
export const isTokenActive = (token: string): boolean => {
    const tokenData = activeTokens[token];
    return !!(tokenData && tokenData.expiresAt > new Date()); // ตรวจสอบว่า token ยังไม่หมดอายุ
};

// ฟังก์ชันสำหรับล้าง token ที่หมดอายุแล้ว (ออปชันเสริม)
export const cleanupExpiredTokens = () => {
    const now = new Date();
    for (const token in activeTokens) {
        if (activeTokens[token].expiresAt <= now) {
            delete activeTokens[token]; // ลบ token ที่หมดอายุแล้ว
        }
    }
};

export const findUsers = async (where: Prisma.UserWhereInput) => {
 return await prisma.user.findMany({where,select:{id:true, username:true, branch:true}});
};

export const loginUser = async (where: Prisma.UserWhereUniqueInput)=>{
    return await prisma.user.findUnique({
        where,
        select:{id:true,username:true,branch:true, password:true},
    });
}

export const findUser = async (where: Prisma.UserWhereUniqueInput)=>{
    return await prisma.user.findUnique({
        where,
        select:{id:true,username:true,branch:true},
    });
}
