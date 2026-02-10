import express from 'express';
import dotev from 'dotenv';
import pool from './db.js';

dotev.config();

const app = express();
app.use(express.json());

// GET all employees
app.get('/employees', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json(rows);
});

// GET employee by ID
app.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', 
    [id]
    );
    res.json(rows[0]);
});

// POST - add new employee
app.post('/employees', async (req, res) => {
    const { first_name, last_name, email, phone_number, department, salary } = req.body;
    await pool.query(
        'INSERT INTO employees (first_name, last_name, email, phone_number, department, salary) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, phone_number, department, salary]
    );
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json(rows);
});

// PATCH - update employee
app.patch('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, department, salary } = req.body;

    await pool.query(
        `UPDATE employees 
        SET first_name = ?, last_name = ?, email = ?, phone_number = ?, department = ?, salary = ? WHERE employee_id = ?`,
        [first_name, last_name, email, phone_number, department, salary, id]
    );

    const [rows] = await pool.query(
        'SELECT * FROM employees WHERE employee_id = ?',
        [id]
    );
    res.json(rows[0]);
});

// DELETE - delete employee
app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE employee_id = ?', [id]);
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json(rows);
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});