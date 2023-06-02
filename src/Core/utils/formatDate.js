import moment from 'moment';

/**
 * @param {string | Date} date
 */
export default function formatDate(date) {
	return moment(date).format('DD/MM/YYYY');
}
