import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jsm.rn.aora',
  projectId: '671e94b60002c5d36f7f',
  databaseId: '671e9a2000234e2503d1',
  userCollectionId: '671e9a5a0004da897aba',
  videoCollectionId: '671e9aa4002eadc5986b',
  storageId: '671eaab30000d0fd4bdd'
}

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

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
      config.databaseId,
      config.userCollectionId,
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
      config.databaseId,
      config.userCollectionId,
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
      config.databaseId,
      config.videoCollectionId,
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
      config.databaseId,
      config.videoCollectionId,
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
      config.databaseId,
      config.videoCollectionId,
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
      config.databaseId,
      config.videoCollectionId,
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
      config.databaseId,
      config.videoCollectionId,
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
      config.databaseId,
      config.videoCollectionId,
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
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        config.storageId,
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
  // const { mimeType, ...rest } = file; // For DocumentPicker
  // const asset = { type: mimeType, ...rest }; // For DocumentPicker

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  }

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
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
      config.databaseId,
      config.videoCollectionId,
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

  console.log('1', config.databaseId);
  console.log('2', config.userCollectionId);
  console.log('3', userId);
  console.log('4', bookmarkList);
  try {
    const update = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {bookmarked: bookmarkList}
    )

    return update;
  } catch (error) {
    console.log('Error(updateBookmarkList): ', error);
    throw new Error(error);
  }
}