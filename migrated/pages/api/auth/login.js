// Example login API endpoint for the Next.js blog
// This is just a placeholder - replace with actual authentication logic

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed'
    });
  }
  
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Mock successful authentication
    // In a real app, this would validate against a database
    if (email === 'demo@example.com' && password === 'password') {
      // Return successful response with mock token
      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'demo@example.com',
            name: 'Demo User'
          }
        }
      });
    }
    
    // Authentication failed
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
} 