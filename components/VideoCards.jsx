import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av'
import { updateBookmarkList } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';

const VideoCards = (props) => {
const {
  video: {
    title,
    thumbnail,
    video: videoItem,
    creator: {
      username,
      avatar
    },
    $id: videoId
  }
}  = props

  const { user, setUser } = useGlobalContext();
  const [play, setPlay] = useState(false);

  const saveToBookmark = async () => {
    const liked = [...(user?.bookmarked)];
    const getIndex = liked.findIndex((v) => v.$id === videoId);

    if (getIndex === -1) {
      liked.push(props);
    } else {
      liked.splice(getIndex, 1);
    }
    setUser({ ...user, bookmarked: liked });
    await updateBookmarkList(user.$id, liked);
  }


  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View
            className="w-[46px] h-[46px] rounded-lg border border-secondary 
              justify-center items-center"
          >
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular "
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <TouchableOpacity
            className="w-8 h-8"
            onPress={() => saveToBookmark()}
          >
            <Image
              source={
                (user?.bookmarked.map(v=>v.$id)).includes(videoId) ?
                  icons.bookmarkSaved
                  : icons.bookmarkSave
              }
              className="w-full h-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {
        play ? (
          <Video
            source={{ uri: videoItem }}
            className="w-full h-60 rounded-xl"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay // native control
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        ) : (
          <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            TouchableOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full rounded-xl mt-3"
              resizeMode="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export default VideoCards