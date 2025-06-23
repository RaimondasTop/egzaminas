const { sql } = require('../dbConnection');
const { createTour, getAllTours, getTourByID, getTourByCategory, updateTourPart, filterTours } = require('../models/tourModel');
const { registerForTour, getTourDates, deleteRegistration, updateRegistrationDate, getAllRegistrations, setRegistrationStatus } = require('../models/tourRegistrationModel');
const AppError = require('../utils/appError');

exports.createTour = async (req, res, next) => {
    try {
        const newTour = req.body;
        const createdTour = await createTour(newTour);

        console.log("eeeeeeeeeeeee", req.user);
        res.status(201).json({
            status: "success",
            data: createdTour,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTours = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const tours = await getAllTours();

        if (tours.length === 0) {
            return next(new AppError('No tours found', 404));
        }

        res.status(200).json({
            status: 'success',
            resultsCount: tours.length,
            requestedAt: req.requestTime,
            data: tours,
        });

    } catch (error) {
        next(error);
    }
};

exports.getOneTour = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tour = await getTourByID(id);

        if (!tour) {
            return next(new AppError('Invalid tour ID', 404));
        }

        res.status(200).json({
            status: "success",
            data: tour,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTour = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newTour = req.body;

        const updatedTour = await updateTourPart(id, newTour);

        if (!updatedTour) {
            return next(new AppError('Invalid tour ID', 404));
        }

        res.status(200).json({
            status: "success",
            data: updatedTour,
        });
    } catch (error) {
        next(error);
    }
};

exports.getFilteredTours = async (req, res, next) => {
    try {
        const filter = req.query;
        const allowedFields = ["duration", "price"];

        for (const key of Object.keys(filter)) {
            if (!allowedFields.includes(key)) {
                return next(new AppError(
                    `Invalid field '${key}'. Allowed fields are: ${allowedFields.join(", ")}`,
                    400
                ));
            }
        }

        let tours;
        if (Object.keys(filter).length === 0) {
            tours = await getAllTours();
        } else {
            tours = await filterTours(filter);
        }

        res.status(200).json({
            status: "success",
            data: tours,
        });
    } catch (error) {
        next(error);
    }
};

exports.registerForTour = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const tour_id = parseInt(req.params.id);
    const { tour_date_id } = req.body;
    if (!tour_date_id) {
      return res.status(400).json({ status: 'fail', message: 'Reikia pasirinkti ekskursijos datą' });
    }
    const registration = await registerForTour({ user_id, tour_id, tour_date_id });
    res.status(201).json({ status: 'success', data: registration });
  } catch (error) {
    next(error);
  }
};

exports.getTourDates = async (req, res, next) => {
  try {
    const tour_id = parseInt(req.params.id);
    const dates = await getTourDates(tour_id);
    res.status(200).json({ status: 'success', data: dates });
  } catch (error) {
    next(error);
  }
};

exports.deleteRegistration = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const registration_id = parseInt(req.params.registrationId);
    const deleted = await deleteRegistration({ user_id, registration_id });
    if (!deleted) {
      return res.status(404).json({ status: 'fail', message: 'Registracija nerasta' });
    }
    res.status(200).json({ status: 'success', data: deleted });
  } catch (error) {
    next(error);
  }
};

exports.updateRegistrationDate = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const registration_id = parseInt(req.params.registrationId);
    const { new_tour_date_id } = req.body;
    if (!new_tour_date_id) {
      return res.status(400).json({ status: 'fail', message: 'Reikia nurodyti naują datą' });
    }
    const updated = await updateRegistrationDate({ user_id, registration_id, new_tour_date_id });
    if (!updated) {
      return res.status(404).json({ status: 'fail', message: 'Registracija nerasta' });
    }
    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await sql`DELETE FROM tours WHERE id = ${id} RETURNING *;`;
    if (!deleted[0]) {
      return res.status(404).json({ status: 'fail', message: 'Ekskursija nerasta' });
    }
    res.status(200).json({ status: 'success', data: deleted[0] });
  } catch (error) {
    next(error);
  }
};

// Pridėti kelias datas prie ekskursijos
exports.pridetiDatas = async (req, res, next) => {
  try {
    const tour_id = parseInt(req.params.id);
    const { dates } = req.body; // masyvas datų
    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Reikia pateikti datas' });
    }
    const inserted = await Promise.all(
      dates.map(date =>
        sql`INSERT INTO tour_dates (tour_id, tour_date) VALUES (${tour_id}, ${date}) RETURNING *;`
      )
    );
    res.status(201).json({ status: 'success', data: inserted.map(i => i[0]) });
  } catch (error) {
    next(error);
  }
};

// Redaguoti vieną datą
exports.redaguotiData = async (req, res, next) => {
  try {
    const dateId = parseInt(req.params.dateId);
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ status: 'fail', message: 'Reikia pateikti naują datą' });
    }
    const updated = await sql`UPDATE tour_dates SET tour_date = ${date} WHERE id = ${dateId} RETURNING *;`;
    if (!updated[0]) {
      return res.status(404).json({ status: 'fail', message: 'Data nerasta' });
    }
    res.status(200).json({ status: 'success', data: updated[0] });
  } catch (error) {
    next(error);
  }
};

// Ištrinti vieną datą
exports.istrintiData = async (req, res, next) => {
  try {
    const dateId = parseInt(req.params.dateId);
    const deleted = await sql`DELETE FROM tour_dates WHERE id = ${dateId} RETURNING *;`;
    if (!deleted[0]) {
      return res.status(404).json({ status: 'fail', message: 'Data nerasta' });
    }
    res.status(200).json({ status: 'success', data: deleted[0] });
  } catch (error) {
    next(error);
  }
};

// Visi dalyviai pagal ekskursiją (arba visus)
exports.gautiDalyvius = async (req, res, next) => {
  try {
    let tour_id = null;
    // Tik jei tour_id yra skaičius ir didesnis už nulį, perduodam į SQL, kitaip - null
    if (
      req.query.tour_id !== undefined &&
      req.query.tour_id !== null &&
      req.query.tour_id !== '' &&
      !isNaN(Number(req.query.tour_id)) &&
      Number(req.query.tour_id) > 0
    ) {
      tour_id = Number(req.query.tour_id);
    }
    const registrations = await getAllRegistrations(tour_id);
    res.status(200).json({ status: 'success', data: registrations });
  } catch (error) {
    next(error);
  }
};

// Patvirtinti/atmesti registraciją
exports.patvirtintiDalyvi = async (req, res, next) => {
  try {
    const registration_id = parseInt(req.params.registrationId);
    const { is_confirmed } = req.body;
    if (typeof is_confirmed !== 'boolean') {
      return res.status(400).json({ status: 'fail', message: 'Reikia nurodyti is_confirmed (true/false)' });
    }
    const updated = await setRegistrationStatus(registration_id, is_confirmed);
    if (!updated) {
      return res.status(404).json({ status: 'fail', message: 'Registracija nerasta' });
    }
    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};
