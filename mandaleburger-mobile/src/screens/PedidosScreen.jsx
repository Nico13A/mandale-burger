import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  AppState,
} from "react-native";
import { useOrdenes } from "../hooks/useOrdenes";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";
import { useEffect, useState } from "react";

export default function PedidosScreen() {
  const { ordenes, cargando, error, cargarOrdenes } = useOrdenes();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(20))[0];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return styles.statusPending;
      case "paid":
        return styles.statusPaid;
      case "in_progress":
        return styles.statusInProgress;
      case "ready_for_pickup":
        return styles.statusReady;
      case "picked_up":
        return styles.statusPicked;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const statusText = {
    pending: "Pendiente",
    paid: "Pagado",
    in_progress: "En proceso",
    ready_for_pickup: "Listo para retirar",
    picked_up: "Retirado",
    cancelled: "Cancelado",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  useEffect(() => {
    if (!cargando && ordenes.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cargando, ordenes]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        cargarOrdenes();  
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mis pedidos</Text>
      {cargando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON_HOVER} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
        </View>
      ) : ordenes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="receipt-outline"
            size={100}
            color={COLORS.TEXTO_GRIS_CLARITO}
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.emptyText}>Todavía no hiciste ningún pedido</Text>
          <Text style={styles.emptySubText}>
            Cuando hagas tu primer pedido, aparecerá acá.
          </Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY }] }}>
          <ScrollView
            contentContainerStyle={{
              paddingTop: 20,
              paddingHorizontal: 20,
              gap: 14,
              paddingBottom: 90
            }}
          >
            {ordenes && ordenes.map((item) => (
              <View key={item.id}>
                <View style={styles.card}>
                  {/* HEADER */}
                  <View>
                    <View style={styles.row}>
                      <Text style={styles.orderId}>Orden #{item.id}</Text>

                      <View
                        style={[styles.statusBadge, getStatusStyle(item.status)]}
                      >
                        <Text style={styles.statusText}>
                          {statusText[item.status.toLowerCase()] || item.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.dateText}>
                      {formatDate(item.created_at)} hs
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>${item.total_price}</Text>
                  </View>

                  {/* ITEMS */}
                  {item.items?.length > 0 && (
                    <View style={styles.itemsContainer}>
                      <Text style={styles.itemsTitle}>Productos</Text>

                      {item.items.map((p) => (
                        <View key={p.id} style={styles.itemRow}>
                          <View style={styles.itemLeft}>
                            <View style={styles.itemQty}>
                              <Text style={styles.itemQtyText}>{p.quantity}x</Text>
                            </View>

                            <Text style={styles.itemName}>
                              {p.item_type === "promotion"
                                ? p.promotion?.name || "Promoción"
                                : p.item_type === "custom_burger"
                                ? p.custom_burger?.custom_name || "Hamburguesa personalizada"
                                : p.menu_burger?.name || "Hamburguesa del menú"}
                            </Text>
                          </View>

                          <Text style={styles.itemPrice}>${p.total_price}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: COLORS.GRIS_BOTON,
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.GRIS_BOTON,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderId: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  dateText: {
    fontSize: 14,
    marginVertical: 10,
    color: COLORS.TEXTO_GRIS_CLARITO,
  },
  totalLabel: {
    color: COLORS.TEXTO_GRIS_CLARITO,
    fontSize: 12,
  },
  totalPrice: {
    color: COLORS.NARANJA_BOTON,
    fontSize: 22,
    fontWeight: "700",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: "600" },

  statusPending: { backgroundColor: "#fef3c7", borderColor: "#fde68a" },
  statusPaid: { backgroundColor: "#fee2e2", borderColor: "#fca5a5" },
  statusInProgress: { backgroundColor: "#dbeafe", borderColor: "#bfdbfe" },
  statusReady: { backgroundColor: "#dcfce7", borderColor: "#bbf7d0" },
  statusPicked: { backgroundColor: "#e5e7eb", borderColor: "#d1d5db" },
  statusCancelled: { backgroundColor: "#fee2e2", borderColor: "#fecaca" },
  statusDefault: { backgroundColor: "#eee", borderColor: "#ccc" },

  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 14,
    paddingTop: 14,
  },
  itemsTitle: {
    color: "#ccc",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemQty: {
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemQtyText: {
    color: "#aaa",
    fontSize: 14,
  },
  itemName: {
    color: "#aaa",
    fontSize: 14,
  },
  itemPrice: {
    color: "#bbb",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.GRIS_BOTON_HOVER,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    color: COLORS.TEXTO_GRIS_CLARITO,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 300,
  },
});
