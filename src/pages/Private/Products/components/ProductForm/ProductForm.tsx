import { dialogCloseSubject$ } from "@/components/CustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateProductFormValues,
  CreateProductSchema,
  Product,
} from "@/models/product";
import { useGetCategoriesQuery } from "@/services/categoriesApi";
import { useCreateProductMutation } from "@/services/productApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export default function ProductForm({ product, setProduct }: ProductFormProps) {
  console.log(product);
  const [create, { isLoading }] = useCreateProductMutation();

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

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
      await create(data).unwrap();
      snackbar.openSnackbar(`Producto ${data.name} creado con éxito`);
      dialogCloseSubject$.setSubject = false;
    } catch (e) {
      console.log(e);
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
            defaultValue={product?.categoryId}
            label="Categoria"
            {...register("categoryId")}
          >
            <MenuItem value=""></MenuItem>
            {
              // TODO: Fetch categories from the API and render them here
              categories?.map((category) => (
                <MenuItem value={category.uuid}>{category.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setProduct(null);
              dialogCloseSubject$.setSubject = true;
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
            loadingPosition="end"
          >
            {product ? "Editar" : "Agregar"}
          </Button>
        </Stack>
      </Box>
    </>
  );
}
