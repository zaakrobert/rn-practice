import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const CONFIG = {
  ENDPOINT: 'https://cloud.appwrite.io/v1',
  PLATFORM: 'com.jsm.rn.aora',
  PROJECT_ID: '671e94b60002c5d36f7f',
  DATABASE_ID: '671e9a2000234e2503d1',
  USER_COLLECTION_ID: '671e9a5a0004da897aba',
  VIDEO_COLLECTION_ID: '671e9aa4002eadc5986b',
  STORAGE_ID: '671eaab30000d0fd4bdd'
}

const client = new Client();

client
  .setEndpoint(CONFIG.ENDPOINT)
  .setProject(CONFIG.PROJECT_ID)
  .setPlatform(CONFIG.PLATFORM)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.USER_COLLECTION_ID,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    return newUser
  } catch (error) {
    console.log('Error(createUser): ', error);
    throw new Error(error);
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(
      email,
      password
    )

    return session;
  } catch (error) {
    console.log('Error(signIn): ', error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.USER_COLLECTION_ID,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log('Error(getCurrentUser): ', error)
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      [Query.orderDesc('$createdAt')]
    )

    return posts.documents;
  } catch (error) {
    console.log('Error(getAllPosts): ', error);
    throw new Error(error);
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )

    return posts.documents;
  } catch (error) {
    console.log('Error(getAllPosts): ', error);
    throw new Error(error);
  }
}

export const searchPosts = async (searchType, query) => {
  try {
    const posts = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      [Query.search(searchType, query)]
    )

    return posts.documents;
  } catch (error) {
    console.log('Error(searchPosts): ', error);
    throw new Error(error);
  }
}

export const searchPostById = async (query) => {
  try {
    const posts = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      [Query.search('title', query)]
    )

    return posts.documents;
  } catch (error) {
    console.log('Error(searchPosts): ', error);
    throw new Error(error);
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      [Query.equal('creator', userId)]
    )

    return posts.documents;
  } catch (error) {
    console.log('Error(getUserPosts): ', error);
    throw new Error(error);
  }
}

export const getBookmarkPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      [Query.equal('creator', userId)]
    )

    return posts.documents;
  } catch (error) {
    console.log('Error(getBookmarkPosts): ', error);
    throw new Error(error);
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    console.log('Error(signOut): ', error);
    throw new Error(error);
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(CONFIG.STORAGE_ID, fileId);
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        CONFIG.STORAGE_ID,
        fileId,
        2000,// width
        2000,// height
        'top',// gravity
        100// quality
      );
    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log('Error(getFilePreview): ', error);
    throw new Error(error);
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  }

  try {
    const uploadedFile = await storage.createFile(
      CONFIG.STORAGE_ID,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview(uploadedFile.$id, type)
    return fileUrl;
  } catch (error) {
    console.log('Error(uploadFile): ', error);
    throw new Error(error);
  }
}

export const createPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])

    const newPost = databases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.VIDEO_COLLECTION_ID,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )

    return newPost;
  } catch (error) {
    console.log('Error(createPost): ', error);
    throw new Error(error);
  }
}

export const updateBookmarkList = async (userId, bookmarkList) => {
  try {
    const update = await databases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.USER_COLLECTION_ID,
      userId,
      { bookmarked: bookmarkList }
    )

    return update;
  } catch (error) {
    console.log('Error(updateBookmarkList): ', error);
    throw new Error(error);
  }
}