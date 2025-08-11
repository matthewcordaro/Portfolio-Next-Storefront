import { fetchAdminProduct, updateProductAction } from "@/utils/actions"
import FormContainer from "@/components/form/FormContainer"
import FormInput from "@/components/form/FormInput"
import PriceInput from "@/components/form/PriceInput"
import TextAreaInput from "@/components/form/TextAreaInput"
import { SubmitButton } from "@/components/form/Buttons"
import CheckboxInput from "@/components/form/CheckBoxInput"
import { BsLink45Deg } from "react-icons/bs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = await fetchAdminProduct(id)
  const { name, company, description, featured, price } = product
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>update product</h1>
      <div className='border p-8 rounded-md'>
        <FormContainer action={updateProductAction}>
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <input type='hidden' name='id' value={id} />
            <FormInput
              type='text'
              name='name'
              label='product name'
              defaultValue={name}
            />
            <FormInput
              type='text'
              name='company'
              label='company'
              defaultValue={company}
            />
            <PriceInput defaultValue={price} />
          </div>
          <TextAreaInput
            name='description'
            labelText='product description'
            defaultValue={description}
          />
          <div className='mt-6'>
            <CheckboxInput
              name='featured'
              label='featured'
              defaultChecked={featured}
            />
          </div>
          <div className='grid-cols space-x-4'>
            <SubmitButton text='update product' className='mt-8' />
            <Link href={`/products/${id}`}>
              <Button className='mt-8 capitalize' size={"lg"} variant="link">
                <BsLink45Deg className='h-4 w-4' />
                View Product
              </Button>
            </Link>
          </div>
        </FormContainer>
      </div>
    </section>
  )
}
export default EditProductPage
