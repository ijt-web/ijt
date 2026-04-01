import { SignJWT, jwtVerify } from 'jose';

const STUDENT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'student-secret');
const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'admin-secret');

export async function signStudentToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(STUDENT_SECRET);
}

export async function verifyStudentToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, STUDENT_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function signAdminToken() {
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(ADMIN_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}
