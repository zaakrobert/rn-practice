import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCards from '../../components/VideoCards'
import CustomButton from '../../components/CustomButton'
import { useFocusEffect } from 'expo-router'

const Home = () => {
  const { data: posts, isLoading: postsIsLoading, refetch: refetchPosts } = useAppwrite(getAllPosts);
  const { data: latestPosts, isLoading: latestPostsIsLoading, refetch: refetchLatestePosts } = useAppwrite(getLatestPosts);

  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  // console.log('^^^ posts', posts)

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    //re call videos --> if any new videos appeared
    await refetchPosts();
    await refetchLatestePosts();
    setRefreshing(false);
  }

  useFocusEffect(useCallback(()=>{
    onRefresh();
  },[]))

  // console.log('likedList', user);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList // Verticle FlatList and horizontal FlatList need to be seperate
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCards video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username.slice(0, 1).toUpperCase() + user?.username.slice(1)}
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

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
            customButton={
              <CustomButton
                title="Create video"
                handlePress={() => router.push('/create')}
                containerStyles="w-full my-5"
              />
            }
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Home