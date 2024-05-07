'use strict';

const { Reservation, Utilisateur , Vols } = require('../Models/models');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'reservations.log', level: 'info' })
    ],
});

exports.create = async (req, res) => {
    try {
        const reservation = await Reservation.create(req.body);
        res.json(reservation);
        const utilisateur = await Utilisateur.findByPk(req.body.user_id);
        const vol = await Vols.findByPk(req.body.vol_id);
        logger.info('Reservation Created:', { reservation: reservation.toJSON() , utilisateur: utilisateur.toJSON(), vol: vol.toJSON() });
    } catch (error) {
        res.status(400).json({ error: error.message });
        logger.error('Error creating reservation', { error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.json(reservations);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

exports.getById = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        res.json(reservation);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

exports.update = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
          await reservation.update(req.body);
          res.json(reservation);
        } else {
          res.status(404).json({ error: 'Reservation not found' });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

exports.delete = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
          await reservation.destroy();
          res.json({ message: 'Reservation deleted' });
        } else {
          res.status(404).json({ error: 'Reservation not found' });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}
