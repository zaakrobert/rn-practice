import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { searchPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCards from '../../components/VideoCards'
import { router, usePathname } from 'expo-router'
import CustomButton from '../../components/CustomButton'

const Bookmark = () => {
  const { user: { bookmarked: bookmarkList} } = useGlobalContext();
  // const { data: Posts, isLoading, refetch } = useAppwrite(() => searchPosts('documentId', bookmarkList));

  const pathname = usePathname()
  // console.log('pathname==> ', pathname);//    /bookmark
  

  // const [refreshing, setRefreshing] = useState(false)

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   //re call videos --> if any new videos appeared
  //   await refetch();
  //   setRefreshing(false);
  // }


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={bookmarkList}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCards video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-2xl font-psemibold text-white">
                Bookmark list
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Liked Video"
            subtitle="Go and browse some funny videos"
            customButton={
              <CustomButton
                title="Browse video"
                handlePress={() => router.push('/home')}
                containerStyles="w-full my-5"
              />
            }
          />
        )}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Bookmark