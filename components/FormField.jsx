import { View, Text, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {

  const [showPassword, setShowPassword] = useState(false)


  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text
        className="text-base text-gray-100 font-pmedium"
      >
        {title}
      </Text>

      <View
        className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 
        rounded-2xl focus:border-secondary items-center flex-row"
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword} // This hides what you're typing
        />
        {
          title === 'Password' && 
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
            className="w-6 h-6 "
            source={!showPassword ? icons.eye : icons.eyeHide}
            resizeMode="contain"
            />
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default FormField