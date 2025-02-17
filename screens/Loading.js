import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

const Loading = () => {
    const navigation = useNavigation(); // Get navigation object

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home'); // Navigate to Home after 1 second
        }, 1000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)', // Optional background overlay
    },
});

export default Loading;
