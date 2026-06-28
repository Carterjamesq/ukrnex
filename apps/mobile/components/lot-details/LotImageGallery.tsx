import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LotImageSource } from "@/types/lot";
import { toImageSource } from "@/types/lot";
import { colors, radius } from "@/constants/theme";

type LotImageGalleryProps = {
  images: LotImageSource[];
  height?: number;
};

export function LotImageGallery({ images, height = 192 }: LotImageGalleryProps) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const galleryWidth = screenWidth - 32;

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const listRef = useRef<FlatList<LotImageSource>>(null);
  const modalListRef = useRef<FlatList<LotImageSource>>(null);

  if (images.length === 0) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <MaterialIcons name="photo-camera" size={32} color={colors.specLabel} />
        <Text style={styles.placeholderText}>Фото відсутні</Text>
      </View>
    );
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>, width: number) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  function openFullscreen(index: number) {
    setActiveIndex(index);
    setFullscreen(true);
    requestAnimationFrame(() => {
      modalListRef.current?.scrollToIndex({ index, animated: false });
    });
  }

  function renderImage(source: LotImageSource, width: number, imageHeight: number) {
    return (
      <Image
        source={toImageSource(source)}
        style={{ width, height: imageHeight }}
        resizeMode="cover"
      />
    );
  }

  return (
    <>
      <View style={[styles.gallery, { height }]}>
        <FlatList
          ref={listRef}
          data={images}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          onMomentumScrollEnd={(event) => handleScrollEnd(event, galleryWidth)}
          onScrollEndDrag={(event) => handleScrollEnd(event, galleryWidth)}
          getItemLayout={(_, index) => ({
            length: galleryWidth,
            offset: galleryWidth * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => openFullscreen(index)} style={{ width: galleryWidth, height }}>
              {renderImage(item, galleryWidth, height)}
            </Pressable>
          )}
        />

        {images.length > 1 ? (
          <>
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {activeIndex + 1} / {images.length}
              </Text>
            </View>

            <View style={styles.dots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Відкрити фото"
            onPress={() => openFullscreen(0)}
            style={styles.expandHint}
          >
            <MaterialIcons name="zoom-out-map" size={14} color={colors.white} />
          </Pressable>
        )}
      </View>

      <Modal visible={fullscreen} animationType="fade" transparent onRequestClose={() => setFullscreen(false)}>
        <View style={[styles.modal, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalCounter}>
              {activeIndex + 1} / {images.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Закрити галерею"
              hitSlop={12}
              onPress={() => setFullscreen(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </Pressable>
          </View>

          <FlatList
            ref={modalListRef}
            data={images}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeIndex}
            keyExtractor={(_, index) => `modal-${index}`}
            onMomentumScrollEnd={(event) => handleScrollEnd(event, screenWidth)}
            onScrollEndDrag={(event) => handleScrollEnd(event, screenWidth)}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={{ width: screenWidth, flex: 1, justifyContent: "center" }}>
                <Image
                  source={toImageSource(item)}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gallery: {
    backgroundColor: colors.imageBg,
    position: "relative",
  },
  placeholder: {
    backgroundColor: colors.imageBg,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.specLabel,
  },
  counter: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.white,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  expandHint: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: radius.sm,
    padding: 6,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalCounter: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
});
