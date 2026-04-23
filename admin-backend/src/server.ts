import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Admin Backend Server running on port ${PORT}`);
  });
});
