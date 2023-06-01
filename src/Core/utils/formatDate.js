import moment from 'moment/moment';

/**
 *
 * @param {string | Date} date
 */
export default function formatDate(date) {
	return moment(date).format('D/M/YYYY');
}
