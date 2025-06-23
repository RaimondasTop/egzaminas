const express = require('express');
const validateNewTour = require('../validator/newTour');
const validate = require('../validator/validate');
const { protect, allowAccessTo } = require('../controller/authController');
const {
  createTour,
  getTours,
  getOneTour,
  getTourByCategory,
  updateTour,
  getFilteredTours,
  registerForTour,
  getTourDates,
  deleteRegistration,
  updateRegistrationDate,
  deleteTour,
  pridetiDatas,
  redaguotiData,
  istrintiData,
  gautiDalyvius,
  patvirtintiDalyvi
} = require('../controller/tourController');

const router = express.Router();

router.route('/')
  .post(protect, allowAccessTo('admin', 'editor'), validateNewTour, validate, createTour)
  .get(getTours);

router.get('/filter', getFilteredTours);

router.get('/registrations', protect, allowAccessTo('admin', 'editor'), gautiDalyvius);
router.patch('/registrations/:registrationId', protect, allowAccessTo('admin', 'editor'), patvirtintiDalyvi);

router.delete('/registration/:registrationId', protect, deleteRegistration);
router.patch('/registration/:registrationId', protect, updateRegistrationDate);

router.post('/:id/datos', protect, allowAccessTo('admin', 'editor'), pridetiDatas);
router.patch('/datos/:dateId', protect, allowAccessTo('admin', 'editor'), redaguotiData);
router.delete('/datos/:dateId', protect, allowAccessTo('admin', 'editor'), istrintiData);

router.post('/:id/register', protect, registerForTour);

router.get('/:id/dates', getTourDates);

router.route('/:id')
  .get(getOneTour)
  .put(updateTour)
  .delete(protect, allowAccessTo('admin', 'editor'), deleteTour);

module.exports = router;
