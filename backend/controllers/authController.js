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
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token, role, and userId in the response
    res.status(201).json({ 
      message: 'User registered', 
      accessToken, 
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
  
      const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ accessToken, user, role: user.role, userId:user.id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('../models');

// // Helper function to generate tokens
// const generateTokens = (user) => {
//   const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Short-lived access token
//   const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Long-lived refresh token
//   return { accessToken, refreshToken };
// };

// // Register a new user
// exports.register = async (req, res) => {
//   const { username, password, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await db.user.create({ username, password: hashedPassword, role });

//     // Generate tokens
//     const { accessToken, refreshToken } = generateTokens(user);

//     // Save the refresh token in the database
//     await db.refresh_token.create({ token: refreshToken, userId: user.id });

//     res.status(201).json({
//       message: 'User registered',
//       accessToken,
//       refreshToken,
//       user,
//       role: user.role,
//       userId: user.id,
//     });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Error registering user', error });
//   }
// };
  
// // Login a user
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   // Check if username and password are provided
//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required', data:req.body });
//   }

//   try {
//     const user = await db.user.findOne({ where: { username } });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate tokens
//     const { accessToken, refreshToken } = generateTokens(user);

//     // Save the refresh token in the database
//     await db.refresh_token.create({ token: refreshToken, userId: user.id });

//     res.json({
//       accessToken,
//       refreshToken,
//       user,
//       role: user.role,
//       userId: user.id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };

// // Refresh access token
// exports.refreshToken = async (req, res) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return res.status(401).json({ message: 'Refresh token is required' });
//   }

//   try {
//     // Verify the refresh token
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

//     // Check if the refresh token exists in the database
//     const storedToken = await db.refresh_token.findOne({
//       where: { token: refreshToken, userId: decoded.id },
//     });

//     if (!storedToken) {
//       return res.status(403).json({ message: 'Invalid refresh token' });
//     }

//     // Generate a new access token
//     const user = await db.user.findByPk(decoded.id);
//     const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

//     res.json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(403).json({ message: 'Invalid refresh token' });
//   }
// };

// exports.registerClient = async (req, res) => {
//   const { username, password, role } = req.body;

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     // Create the user in the database
//     const user = await db.user.create({ username, password: hashedPassword, role });

//     // // Generate a JWT token
//     // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Return the token, role, and userId in the response
//     res.status(201).json({
//       message: 'User registered', 
//       // token, 
//       // role: user.role, 
//       // userId: user.id 
//     });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Error registering user', error });
//   }
// };

// exports.logout = async (req, res) => {
//   const { refreshToken } = req.body;

//   try {
//     // Delete the refresh token from the database
//     await db.refresh_token.destroy({ where: { token: refreshToken } });

//     res.status(200).json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error logging out' });
//   }
// };