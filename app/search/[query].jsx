import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCards from '../../components/VideoCards'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '../../components/CustomButton'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, isLoading, refetch } = useAppwrite(() => searchPosts('title', query));

  // console.log('qq', query);
  // console.log('posts', posts);
  

  useEffect(() => {
    refetch();
  }, [query])




  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList // Verticle FlatList and horizontal FlatList need to be seperate
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCards video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Serach Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {query}
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
            customButton={
              <CustomButton
                title="Create video"
                handlePress={() => router.push('/create')}
                containerStyles="w-full my-5"
              />
            }
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search