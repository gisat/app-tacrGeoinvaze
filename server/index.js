import 'core-js/stable';
import 'regenerator-runtime/runtime';
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`CRA Server listening on port ${PORT}!`);
});
