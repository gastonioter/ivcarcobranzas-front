import { dialogCloseSubject$ } from "@/components/CustomDialog";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateProductFormValues,
  CreateProductSchema,
  Product,
} from "@/models/product";
import { useGetCategoriesQuery } from "@/services/categoriesApi";
import {
  useCreateProductMutation,
  useEditProductMutation,
} from "@/services/productApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export default function ProductForm({ product, setProduct }: ProductFormProps) {
  const [create, { isLoading }] = useCreateProductMutation();
  const [edit, { isLoading: isEditing }] = useEditProductMutation();

  const editMode = !!product;

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  console.log(product);
  const snackbar = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
  });

  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      if (!editMode) {
        await create(data).unwrap();
      } else {
        await edit({ uuid: product?.uuid, ...data }).unwrap();
      }

      dialogCloseSubject$.setSubject = false;
      snackbar.openSnackbar(
        `Producto  ${!editMode && data.name} ${
          editMode ? "editado" : "creado"
        } con éxito`
      );
      setProduct(null);
    } catch (e) {
      snackbar.openSnackbar(`${e.data.error}`, "error");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        <TextField
          label="Nombre del producto"
          {...register("name")}
          error={!!errors.name}
          defaultValue={product?.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Precio de venta"
          {...register("price")}
          type="number"
          defaultValue={product?.price}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <FormControl>
          <InputLabel id="category">Categoria</InputLabel>
          <Select
            disabled={isLoadingCategories}
            labelId="category"
            id="demo-simple-select-helper"
            defaultValue={product?.category.uuid}
            label="Categoria"
            {...register("categoryId")}
          >
            <MenuItem value=""></MenuItem>
            {
              // TODO: Fetch categories from the API and render them here
              categories?.map((category) => (
                <MenuItem key={category.uuid} value={category.uuid}>
                  {category.name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FooterCustomDialog
          isLoading={isLoading || isEditing}
          onClose={() => setProduct(null)}
          editMode={editMode}
        />
      </Box>
    </>
  );
}
