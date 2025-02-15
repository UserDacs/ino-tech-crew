import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES, icons } from '../constants';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';

const LocationDetails = ({ route, navigation }) => {
    const { colors, dark } = useTheme();
    const { location, address, distance } = route.params;

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
                <View style={{
                    width: SIZES.width - 32,
                    marginHorizontal: 16,
                    flexDirection: 'column',
                    marginVertical: 22,
                    alignItems: "center"
                }}>
                    <View style={[styles.boxContainer, { 
                        backgroundColor: dark ? COLORS.dark1 : "#F2F4F9",
                    }]}>
                        <Image
                            source={icons.pin}
                            resizeMode='contain'
                            style={styles.pinIcon}
                        />
                    </View>
                    <Text style={[styles.locationName, { 
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>New Montgomery</Text>
                    <Text style={styles.locationAddress}>4517 Washington Ave. Manchester, Kentucky 39495</Text>
                    <View style={styles.viewLine}>
                        <View style={[styles.viewTime, { marginRight: 36 }]}>
                            <MaterialCommunityIcons name="clock" size={20} color={COLORS.primary} />
                            <Text style={[styles.timeline, { 
                                color: dark? COLORS.white : COLORS.greyscale900
                            }]}>09:00 AM - 05:00PM</Text>
                        </View>
                        <View style={styles.viewTime}>
                            <Image
                                source={icons.routing}
                                resizeMode='contain'
                                style={styles.routingIcon}
                            />
                            <Text style={[styles.timeline, { 
                                 color: dark? COLORS.white : COLORS.greyscale900
                            }]}>4.5 KM from you</Text>
                        </View>
                    </View>
                    <View style={styles.separateLine} />
                    <Text style={styles.trackNumber}>0812274616352</Text>
                    <View style={styles.separateLine} />
                    <Button
                        title="Continue"
                        filled
                        style={{
                            height: 56,
                            borderRadius: 30,
                            width: SIZES.width - 32,
                            marginBottom: 12
                        }}
                        onPress={() => {
                            navigation.navigate("PaymentMethods")
                        }}
                    />
                </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1
    },
    container: {
        width: SIZES.width - 32,
        marginHorizontal: 16,
        flexDirection: 'column',
        marginVertical: 22,
        alignItems: "center"
    },
    boxContainer: {
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        marginBottom: 16
    },
    pinIcon: {
        height: 32,
        width: 32
    },
    locationName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8
    },
    locationAddress: {
        fontSize: 14,
        color: COLORS.grey,
        marginBottom: 16
    },
    viewLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12
    },
    viewTime: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    routingIcon: {
        height: 20,
        width: 20,
        marginRight: 4
    },
    timeline: {
        fontSize: 14,
    },
    separateLine: {
        height: 1,
        width: SIZES.width - 64,
        backgroundColor: COLORS.grey,
        marginVertical: 12
    },
    trackNumber: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default LocationDetails;
