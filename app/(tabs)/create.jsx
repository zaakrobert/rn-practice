import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { TouchableOpacity } from 'react-native'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
// import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { createPost } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const FILE_TYPE = {
  image: 'image',
  video: 'video'
}
const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  });

  const openPicker = async (selectType) => {
    // //For DocumentPicker
    // const result = await DocumentPicker.getDocumentAsync({
    //   type: selectType === FILE_TYPE.image
    //     ? ['image/png', 'image/jpg', 'image/jpeg', 'image/svg']
    //     : ['video/mp4', 'video/gif']
    // })

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === FILE_TYPE.image
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log('aas', result);
    

    if (!result.canceled) {
      if (selectType === FILE_TYPE.image) {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === FILE_TYPE.video) {
        setForm({ ...form, video: result.assets[0] });
      }
    } /* else {
      setTimeout(() => {
        Alert.alert('Document picked', JSON.stringify(result, null, 2));
      }, 100)
    } */
  }
  const submit = async () => {
    if (form.prompt === '' || form.title === '' || !form.thumbnail || !form.video) {
      return Alert.alert('Please fill in all the fields');
    }
    setUploading(true);
    try {
      await createPost({
        ...form,
        userId: user.$id
      })

      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    } catch (error) {
      return Alert.alert('Error', error);
    } finally {
      setUploading(false);
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      })
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catch title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity
            onPress={() => openPicker(FILE_TYPE.video)}
          >
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                // useNativeControls
                resizeMode={ResizeMode.COVER}
              // isLooping
              />
            ) : (
              <View
                className="w-full h-40 px-4 bg-black-100 rounded-2xl 
              justify-center items-center"
              >
                <View
                  className="w-14 h-14 border border-dashed border-secondary-100
                  justify-center items-center"
                >
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity
            onPress={() => openPicker(FILE_TYPE.image)}
          >
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode="cover"
              />
            ) : (
              <View
                className="w-full h-16 px-4 bg-black-100 rounded-2xl 
                  justify-center items-center border-2 border-black-200
                  flex-row space-x-2"
              >
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text
                  className="text-sm text-gray-100 font-pmedium"
                >
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create