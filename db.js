import prompt from 'prompt-async';
import pg from 'pg';
import open from 'open';

const { Client } = pg;
const db = new Client({
  connectionString: 'postgresql://neondb_owner:npg_0pgwJMCOrht1@ep-frosty-fire-a94nhe0n-pooler.gwc.azure.neon.tech/neondb?sslmode=require'
});

async function існує(тел, емейл) {
  const q = 'SELECT 1 FROM students WHERE phone_number = $1 OR email = $2';
  const { rows } = await db.query(q, [тел, емейл]);
  return rows.length > 0;
}

async function додати(дані) {
  const q = 'INSERT INTO students(first_name, last_name, phone_number, email, mark) VALUES($1, $2, $3, $4, $5)';
  await db.query(q, [дані.first_name, дані.last_name, дані.phone_number, дані.email, дані.mark]);
  console.log('Додано!');
}

async function отримати() {
  prompt.start();
  return await prompt.get(["first_name", "last_name", "phone_number", "email", "mark"]);
}

async function головна() {
  try {
    await db.connect();
    let далі = true;

    while (далі) {
      const дані = await отримати();
      const дубль = await існує(дані.phone_number, дані.email);
      if (дубль) {
        console.log('Користувач вже існує.');
      } else {
        await додати(дані);
      }

      const { continueResponse } = await prompt.get(['continueResponse']);
      const вхід = continueResponse.toLowerCase();
      if (вхід === 'ні' || вхід === 'no') {
        await open('https://www.youtube.com/watch?v=ngF23lvNL80');
        далі = false;
      } else {
        далі = вхід === 'так' || вхід === 'yes';
      }
    }
  } catch (e) {
    console.error('Помилка:', e.message);
  } finally {
    await db.end();
  }
}

головна();
