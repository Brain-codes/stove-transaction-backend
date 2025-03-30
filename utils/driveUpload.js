const driveService = require('../config/googleDriveConfig');
const stream = require('stream');

// Cache for folder IDs
let folderCache = {};

const getFolderIdByName = async (folderName) => {
  try {
    // Check cache first
    if (folderCache[folderName]) {
      return folderCache[folderName];
    }

    // Search for the folder
    const response = await driveService.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.data.files.length > 0) {
      // Cache the folder ID
      folderCache[folderName] = response.data.files[0].id;
      return response.data.files[0].id;
    }

    // Create folder if it doesn't exist
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] // Parent folder ID
    };

    const folder = await driveService.files.create({
      requestBody: fileMetadata,
      fields: 'id'
    });

    // Cache the new folder ID
    folderCache[folderName] = folder.data.id;
    return folder.data.id;
  } catch (error) {
    console.error('Error getting/creating folder:', error);
    throw error;
  }
};

const uploadToDrive = async (fileBuffer, fileName, mimeType, folderName) => {
  try {
    // Get or create folder ID
    const folderId = await getFolderIdByName(folderName);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType,
      body: bufferStream
    };

    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    // Make the file publicly accessible
    await driveService.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const directUrl = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=w1000`;

    return {
      fileId: response.data.id,
      url: directUrl
    };
  } catch (error) {
    console.error('Error in uploadToDrive:', error);
    throw error;
  }
};

const deleteFromDrive = async (fileId) => {
  try {
    await driveService.files.delete({
      fileId: fileId
    });
    return true;
  } catch (error) {
    console.error('Error deleting from Drive:', error);
    throw error;
  }
};

module.exports = { uploadToDrive, deleteFromDrive }; 