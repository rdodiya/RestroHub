package com.restroly.qrmenu.food.service;

import com.restroly.qrmenu.category.entity.Category;
import com.restroly.qrmenu.category.repository.CategoryRepository;
import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.config.CloudinaryService;
import com.restroly.qrmenu.food.dto.FoodMapper;
import com.restroly.qrmenu.food.dto.FoodRequestDTO;
import com.restroly.qrmenu.food.dto.FoodResponseDTO;
import com.restroly.qrmenu.food.dto.FoodUpdateDTO;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.food.repository.FoodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link FoodServiceImpl}.
 *
 * <p>All external collaborators (repositories, mapper, cloudinary) are mocked
 * so tests run without a database or Spring context.</p>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("FoodServiceImpl Unit Tests")
class FoodServiceImplTest {

    // ─── Mocks ───────────────────────────────────────────────────────────────

    @Mock
    private FoodRepository foodRepository;

    @Mock
    private FoodMapper foodMapper;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MultipartFile multipartFile;

    // ─── System Under Test ───────────────────────────────────────────────────

    @InjectMocks
    private FoodServiceImpl foodService;

    // ─── Shared Test Fixtures ────────────────────────────────────────────────

    private Food sampleFood;
    private FoodResponseDTO sampleResponse;
    private Category sampleCategory;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category();
        // Use reflection-style setter if Category has no public constructor with args;
        // adjust based on actual Category entity fields.
        sampleCategory.setCategoryId(1L);

        sampleFood = Food.builder()
                .foodId(1L)
                .name("Paneer Tikka")
                .description("Grilled cottage cheese")
                .price(new BigDecimal("180.00"))
                .isAvailable(true)
                .isVeg(true)
                .isDelete(false)
                .category(sampleCategory)
                .build();

        sampleResponse = FoodResponseDTO.builder()
                .foodId(1L)
                .name("Paneer Tikka")
                .description("Grilled cottage cheese")
                .price(new BigDecimal("180.00"))
                .isAvailable(true)
                .isVeg(true)
                .categoryId(1L)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // =========================================================================
    // createFood()
    // =========================================================================

    @Nested
    @DisplayName("createFood()")
    class CreateFoodTests {

        private FoodRequestDTO buildRequest(String name) {
            return FoodRequestDTO.builder()
                    .name(name)
                    .description("Grilled cottage cheese")
                    .price(new BigDecimal("180.00"))
                    .categoryId(1L)
                    .isAvailable(true)
                    .isVeg(true)
                    .build();
        }

        @Test
        @DisplayName("should create food successfully when name is unique and image is absent")
        void createFood_success_noImage() {
            // Arrange
            FoodRequestDTO request = buildRequest("Paneer Tikka");
            given(foodRepository.existsByNameIgnoreCase("Paneer Tikka")).willReturn(false);
            given(categoryRepository.findById(1L)).willReturn(Optional.of(sampleCategory));
            given(foodMapper.toEntity(request)).willReturn(sampleFood);
            given(foodRepository.save(sampleFood)).willReturn(sampleFood);
            given(foodMapper.toResponseDTO(sampleFood)).willReturn(sampleResponse);

            // Act
            FoodResponseDTO result = foodService.createFood(request, null);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Paneer Tikka");
            assertThat(result.getFoodId()).isEqualTo(1L);

            then(foodRepository).should().existsByNameIgnoreCase("Paneer Tikka");
            then(foodRepository).should().save(sampleFood);
            then(cloudinaryService).shouldHaveNoInteractions(); // no image → no upload
        }

        @Test
        @DisplayName("should upload image to Cloudinary when image file is provided")
        void createFood_success_withImage() {
            // Arrange
            FoodRequestDTO request = buildRequest("Masala Dosa");
            Food foodWithoutImage = Food.builder()
                    .name("Masala Dosa")
                    .price(new BigDecimal("90.00"))
                    .category(sampleCategory)
                    .build();

            given(foodRepository.existsByNameIgnoreCase("Masala Dosa")).willReturn(false);
            given(multipartFile.isEmpty()).willReturn(false);
            given(cloudinaryService.uploadImage(multipartFile, "qrmenu/foods"))
                    .willReturn("https://res.cloudinary.com/demo/masala_dosa.jpg");
            given(categoryRepository.findById(1L)).willReturn(Optional.of(sampleCategory));
            given(foodMapper.toEntity(request)).willReturn(foodWithoutImage);
            given(foodRepository.save(foodWithoutImage)).willReturn(foodWithoutImage);
            given(foodMapper.toResponseDTO(foodWithoutImage)).willReturn(sampleResponse);

            // Act
            foodService.createFood(request, multipartFile);

            // Assert
            assertThat(foodWithoutImage.getImageUrl())
                    .isEqualTo("https://res.cloudinary.com/demo/masala_dosa.jpg");
            then(cloudinaryService).should().uploadImage(multipartFile, "qrmenu/foods");
        }

        @Test
        @DisplayName("should throw ResourceAlreadyExistsException when food name already exists")
        void createFood_duplicateName_throwsException() {
            // Arrange
            FoodRequestDTO request = buildRequest("Paneer Tikka");
            given(foodRepository.existsByNameIgnoreCase("Paneer Tikka")).willReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> foodService.createFood(request, null))
                    .isInstanceOf(ResourceAlreadyExistsException.class)
                    .hasMessageContaining("Paneer Tikka");

            then(foodRepository).should(never()).save(any());
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when category does not exist")
        void createFood_categoryNotFound_throwsException() {
            // Arrange
            FoodRequestDTO request = buildRequest("Idli");
            given(foodRepository.existsByNameIgnoreCase("Idli")).willReturn(false);
            given(foodMapper.toEntity(request)).willReturn(sampleFood);
            given(categoryRepository.findById(1L)).willReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> foodService.createFood(request, null))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Category not found");

            then(foodRepository).should(never()).save(any());
        }
    }

    // =========================================================================
    // getFoodById()
    // =========================================================================

    @Nested
    @DisplayName("getFoodById()")
    class GetFoodByIdTests {

        @Test
        @DisplayName("should return FoodResponseDTO when food exists")
        void getFoodById_success() {
            // Arrange
            given(foodRepository.findById(1L)).willReturn(Optional.of(sampleFood));
            given(foodMapper.toResponseDTO(sampleFood)).willReturn(sampleResponse);

            // Act
            FoodResponseDTO result = foodService.getFoodById(1L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getFoodId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Paneer Tikka");
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when food does not exist")
        void getFoodById_notFound_throwsException() {
            // Arrange
            given(foodRepository.findById(99L)).willReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> foodService.getFoodById(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    // =========================================================================
    // getFoodByName()
    // =========================================================================

    @Nested
    @DisplayName("getFoodByName()")
    class GetFoodByNameTests {

        @Test
        @DisplayName("should return food when name matches (case-insensitive)")
        void getFoodByName_success() {
            // Arrange
            given(foodRepository.findByNameIgnoreCase("paneer tikka"))
                    .willReturn(Optional.of(sampleFood));
            given(foodMapper.toResponseDTO(sampleFood)).willReturn(sampleResponse);

            // Act
            FoodResponseDTO result = foodService.getFoodByName("paneer tikka");

            // Assert
            assertThat(result.getName()).isEqualTo("Paneer Tikka");
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when name not found")
        void getFoodByName_notFound_throwsException() {
            // Arrange
            given(foodRepository.findByNameIgnoreCase("Nonexistent"))
                    .willReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> foodService.getFoodByName("Nonexistent"))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Nonexistent");
        }
    }

    // =========================================================================
    // getAllFoods()
    // =========================================================================

    @Nested
    @DisplayName("getAllFoods()")
    class GetAllFoodsTests {

        @Test
        @DisplayName("should return paginated list of all foods")
        void getAllFoods_success() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Food> page = new PageImpl<>(List.of(sampleFood), pageable, 1);
            PageResponseDTO<FoodResponseDTO> expectedPage = PageResponseDTO.<FoodResponseDTO>builder()
                    .content(List.of(sampleResponse))
                    .pageNumber(0)
                    .pageSize(10)
                    .totalElements(1L)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();

            given(foodRepository.findAll(pageable)).willReturn(page);
            given(foodMapper.toPageResponseDTO(page)).willReturn(expectedPage);

            // Act
            PageResponseDTO<FoodResponseDTO> result = foodService.getAllFoods(pageable);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getTotalElements()).isEqualTo(1L);
        }

        @Test
        @DisplayName("should return empty page when no foods exist")
        void getAllFoods_emptyResult() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Food> emptyPage = Page.empty(pageable);
            PageResponseDTO<FoodResponseDTO> emptyPageResponse = PageResponseDTO.<FoodResponseDTO>builder()
                    .content(List.of())
                    .totalElements(0L)
                    .totalPages(0)
                    .build();

            given(foodRepository.findAll(pageable)).willReturn(emptyPage);
            given(foodMapper.toPageResponseDTO(emptyPage)).willReturn(emptyPageResponse);

            // Act
            PageResponseDTO<FoodResponseDTO> result = foodService.getAllFoods(pageable);

            // Assert
            assertThat(result.getContent()).isEmpty();
            assertThat(result.getTotalElements()).isZero();
        }
    }

    // =========================================================================
    // updateAvailability()
    // =========================================================================

    @Nested
    @DisplayName("updateAvailability()")
    class UpdateAvailabilityTests {

        @Test
        @DisplayName("should mark food as unavailable successfully")
        void updateAvailability_markUnavailable() {
            // Arrange
            given(foodRepository.findById(1L)).willReturn(Optional.of(sampleFood));
            given(foodRepository.save(sampleFood)).willReturn(sampleFood);
            FoodResponseDTO unavailableResponse = FoodResponseDTO.builder()
                    .foodId(1L)
                    .name("Paneer Tikka")
                    .isAvailable(false)
                    .build();
            given(foodMapper.toResponseDTO(sampleFood)).willReturn(unavailableResponse);

            // Act
            FoodResponseDTO result = foodService.updateAvailability(1L, false);

            // Assert
            assertThat(sampleFood.getIsAvailable()).isFalse();
            assertThat(result.getIsAvailable()).isFalse();
            then(foodRepository).should().save(sampleFood);
        }

        @Test
        @DisplayName("should mark food as available successfully")
        void updateAvailability_markAvailable() {
            // Arrange
            sampleFood.setIsAvailable(false);
            given(foodRepository.findById(1L)).willReturn(Optional.of(sampleFood));
            given(foodRepository.save(sampleFood)).willReturn(sampleFood);
            given(foodMapper.toResponseDTO(sampleFood)).willReturn(sampleResponse);

            // Act
            foodService.updateAvailability(1L, true);

            // Assert
            assertThat(sampleFood.getIsAvailable()).isTrue();
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when food id does not exist")
        void updateAvailability_notFound_throwsException() {
            // Arrange
            given(foodRepository.findById(99L)).willReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> foodService.updateAvailability(99L, false))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    // =========================================================================
    // deleteFood()
    // =========================================================================

    @Nested
    @DisplayName("deleteFood()")
    class DeleteFoodTests {

        @Test
        @DisplayName("should soft-delete food when it exists")
        void deleteFood_success() {
            // Arrange
            given(foodRepository.existsById(1L)).willReturn(true);

            // Act
            foodService.deleteFood(1L);

            // Assert
            then(foodRepository).should().deleteById(1L);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when food does not exist")
        void deleteFood_notFound_throwsException() {
            // Arrange
            given(foodRepository.existsById(99L)).willReturn(false);

            // Act & Assert
            assertThatThrownBy(() -> foodService.deleteFood(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            then(foodRepository).should(never()).deleteById(any());
        }
    }

    // =========================================================================
    // existsById() / existsByName()
    // =========================================================================

    @Nested
    @DisplayName("existsById() and existsByName()")
    class ExistsTests {

        @Test
        @DisplayName("existsById should delegate to repository")
        void existsById_delegatesToRepository() {
            given(foodRepository.existsById(1L)).willReturn(true);
            assertThat(foodService.existsById(1L)).isTrue();
        }

        @Test
        @DisplayName("existsByName should delegate to repository using case-insensitive check")
        void existsByName_delegatesToRepository() {
            given(foodRepository.existsByNameIgnoreCase("Biryani")).willReturn(true);
            assertThat(foodService.existsByName("Biryani")).isTrue();
        }
    }
}
