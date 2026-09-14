#!/usr/bin/env node
/**
 * Turn a password you choose into the two values the admin needs.
 *
 *   npm run admin:password
 *
 * The password is typed here and never leaves this machine: what it prints is
 * a scrypt hash, which cannot be turned back into the password, and a random
 * session secret. Those two go in the hosting environment. Nobody — including
 * whoever maintains this site — needs to be told the password itself.
 *
 * Reads from the terminal with the echo off, so the password does not end up
 * in the scrollback or in your shell history.
 */
import { createInterface } from 'node:readline';
import { randomBytes } from 'node:crypto';
import { stdin, stdout } from 'node:process';
import { hashPassword } from '../src/lib/admin-auth.ts';

const MIN_LENGTH = 12;

function ask(question, { silent = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: stdin, output: stdout, terminal: true });
    if (silent) {
      // Print the prompt, then swallow everything the terminal would echo.
      stdout.write(question);
      rl._writeToOutput = () => {};
      rl.question('', (answer) => {
        stdout.write('\n');
        rl.close();
        resolve(answer);
      });
      return;
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const password = await ask('รหัสผ่านสำหรับเข้าหน้า admin: ', { silent: true });
if (password.length < MIN_LENGTH) {
  console.error(
    `\nรหัสผ่านสั้นเกินไป ต้องอย่างน้อย ${MIN_LENGTH} ตัวอักษร (พิมพ์ได้ ${password.length})`,
  );
  console.error('ใช้ประโยคที่จำได้จะปลอดภัยกว่าคำสั้น ๆ ที่มีอักขระพิเศษ');
  process.exit(1);
}

const again = await ask('พิมพ์อีกครั้งเพื่อยืนยัน: ', { silent: true });
if (again !== password) {
  console.error('\nสองครั้งไม่ตรงกัน ยังไม่ได้สร้างอะไร ลองใหม่อีกครั้ง');
  process.exit(1);
}

const hash = hashPassword(password);
const secret = randomBytes(32).toString('base64url');

console.log(`
เรียบร้อย นำสองค่านี้ไปใส่ใน Netlify
  Site configuration -> Environment variables

  ADMIN_PASSWORD_HASH
  ${hash}

  ADMIN_SESSION_SECRET
  ${secret}

จากนั้นสั่ง deploy ใหม่หนึ่งครั้ง ค่าใน environment จะมีผลตอน build

หมายเหตุ
  - สองค่านี้ไม่ใช่รหัสผ่าน แปลงกลับเป็นรหัสผ่านไม่ได้ แต่ก็ไม่ควรวางในแชท
    อีเมล หรือที่สาธารณะ ใครได้ ADMIN_SESSION_SECRET ไปสามารถปลอมการล็อกอินได้
  - ถ้าเปลี่ยนรหัสผ่านภายหลัง ให้รันคำสั่งนี้ใหม่แล้วแก้ค่าใน Netlify
    การเปลี่ยน ADMIN_SESSION_SECRET จะเตะทุกคนที่ล็อกอินค้างอยู่ออกทันที
  - อย่าใส่สองค่านี้ลงในไฟล์ในโปรเจกต์ ไฟล์ในโปรเจกต์ขึ้น GitHub ทั้งหมด
`);
