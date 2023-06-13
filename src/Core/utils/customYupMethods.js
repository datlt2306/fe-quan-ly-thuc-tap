import * as yup from 'yup';

yup.addMethod(yup.array, 'unique', function (message, mapper = (a) => a) {
	return this.test('unique', message, function (list) {
		return list.length === new Set(list.map(mapper)).size;
	});
});
