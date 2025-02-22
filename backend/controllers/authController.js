const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

// exports.register = async (req, res) => {
//   const { username, password, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await db.user.create({ username, password: hashedPassword, role });
//   res.status(201).json({ message: 'User registered', user });
// };

exports.registerClient = async (req, res) => {
  const { username, password, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the user in the database
    const user = await db.user.create({ username, password: hashedPassword, role });

    // // Generate a JWT token
    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token, role, and userId in the response
    res.status(201).json({
      message: 'User registered', 
      // token, 
      // role: user.role, 
      // userId: user.id 
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the user in the database
    const user = await db.user.create({ username, password: hashedPassword, role });

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token, role, and userId in the response
    res.status(201).json({ 
      message: 'User registered', 
      token, 
      user, 
      role: user.role, 
      userId: user.id 
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
    console.log('Request Body:', req.body);    
    const { username, password } = req.body;    
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required', data:req.body });
    }
  
    try {
      const user = await db.user.findOne({ where: { username } });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user, role: user.role, userId:user.id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  