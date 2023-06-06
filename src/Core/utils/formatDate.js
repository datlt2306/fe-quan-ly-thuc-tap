import moment from 'moment';

/**
 * @param {string | Date} date
 */
export const formatDate = (date) => {
	return moment(date).format('DD/MM/YYYY');
};

/**
 * @param {string | Date} date
 */
export const convertDate = (date) => {
	return moment(date).format('YYYY-MM-DD');
};
