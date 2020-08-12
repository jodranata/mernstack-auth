const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config/config');
const connectDB = require('./config/db');

connectDB(config.MONGO_URL);

app.use(bodyParser.json());

if (config.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: config.CLIENT_URL,
    }),
  );
  app.use(morgan('dev'));
}

const authRoute = require('./routers/auth.route');
const userRoute = require('./routers/user.route');

app.use('/api/', authRoute);
app.use('/api/', userRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

app.listen(config.PORT, () =>
  console.log(`App is listening on PORT ${config.PORT}`),
);
