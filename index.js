require('dotenv').config();
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://192.168.1.3:${PORT}`);
});
