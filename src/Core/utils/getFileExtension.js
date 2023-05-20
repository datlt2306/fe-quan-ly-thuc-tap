/**
 * @param {File} file
 */
export default function getFileExtension(file) {
	const fileExtension = '.' + file.name.split('.').pop();
	return fileExtension.trim().toLowerCase();
}
