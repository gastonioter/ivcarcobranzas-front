import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CategoryFormData, categorySchema } from "@/models/category";
import { useCreateCategoryMutation } from "@/services/categoriesApi";
import { Box, Button, TextField } from "@mui/material";
import { dialogCloseSubject$ } from "@/components/CustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";

export default function CategoryForm() {
  const [create, { isLoading }] = useCreateCategoryMutation();
  const snackbar = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const newCategory = await create(data).unwrap();
      dialogCloseSubject$.setSubject = false;
      snackbar.openSnackbar(`Categoría ${newCategory.name} creada con éxito`);
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
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre de la categoría"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Descripción"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <Button
          sx={{ mt: 2, width: "fit-content", alignSelf: "flex-end" }}
          type="submit"
          variant="contained"
          color="primary"
          loading={isLoading}
          loadingPosition="end"
        >
          Agregar
        </Button>
      </Box>
    </>
  );
}
