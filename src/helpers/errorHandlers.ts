import express, { NextFunction } from 'express';

export default [
	// Log errors to console
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: NextFunction
	) => {
		console.error(`[${req.path}]`, `${err.name}:`, err.message);
		next(err);
	},

	// Handle unexpected errors
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: NextFunction
	) => {
		res.status(500).json({ error: 'A server error has occured.' });
	},
];
