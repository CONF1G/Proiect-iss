// controllers/userController.js
const users = []; // Array to store user data

// Function to get all users
export const getAllUsers = (req, res) => {
    const q = "SELECT * FROM test.users"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    }); // Send all users as JSON response
};

// Function to create a new user
export const createUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const q = "INSERT INTO users (email, password) VALUES (?, ?)";
  const values = [email, password];

  db.query(q, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    return res.status(201).json({ message: 'User registered successfully', user: { email } });
  });
};
