/* eslint-disable consistent-return */
const express = require('express');
const path = require('path');
const fs = require('fs');
const datauser = require('../users.json');
const jwtAuth = require('../auth/jwt_auth_helper');
const commons = require('../middlewares/common');
// eslint-disable-next-line import/extensions
// eslint-disable-next-line import/extensions, import/no-unresolved
const datalist = require('../listdata.json');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const data = JSON.parse(JSON.stringify(datauser));
  // eslint-disable-next-line no-sequences
  const founddata = data.find((x) => (x.username === req.body.username, 10));
  if (!founddata) {
    const error = new Error('User not found');
    return next(error);
  }
  try {
    const result = await jwtAuth.generateToken({ username, password }, { expiresIn: '1h' });
    if (!result) {
      const error = new Error('Failed to login');
      return next(error);
    }
    res.json({
      success: true,
      data: {
        username,
        token: result,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  const { email, username, password } = req.body;
  const data = { email, username, password: await commons.getHash(password) };
  datauser.push(data);
  const directory = path.join(__dirname, '../users.json');
  const jsonString = JSON.stringify(datauser);
  fs.writeFileSync(directory, jsonString, (err) => {
    if (err) {
      const error = new Error('Failed to write to file');
      return next(error);
    }
    res.json({
      success: true,
      data,
    });
  });

  try {
    res.json({
      success: true,
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/checklist', jwtAuth.verifyToken, async (req, res, next) => {
  const { name } = req.body;
  const lastnumber = datalist.length + 1;
  datalist.push({ name, id: lastnumber });

  const directory = path.join(__dirname, '../listdata.json');
  const jsonString = JSON.stringify(datalist);
  fs.writeFileSync(directory, jsonString, (err) => {
    if (err) {
      const error = new Error('Failed to write to file');
      return next(error);
    }
    res.json({
      success: true,
      data: req.body,
    });
  });
  try {
    res.json({
      success: true,
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
});
router.get('/checklist', jwtAuth.verifyToken, async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(datalist));
  try {
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/checklist/:id', jwtAuth.verifyToken, async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(datalist));
  const founddata = data.find((x) => x.id === parseInt(req.params.id, 10));
  if (!founddata) {
    const error = new Error('Data not found');
    return next(error);
  }
  try {
    res.json({
      success: true,
      data: founddata,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/checklist/:id', jwtAuth.verifyToken, async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(datalist));
  delete data[req.params.id];
  const directory = path.join(__dirname, '../listdata.json');
  const jsonString = JSON.stringify(datalist);
  fs.writeFileSync(directory, jsonString, (err) => {
    if (err) {
      const error = new Error('Failed to write to file');
      return next(error);
    }
    res.json({
      success: true,
      data: req.body,
    });
  });
  try {
    res.json({
      success: true,
      data: 'success delete data',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
