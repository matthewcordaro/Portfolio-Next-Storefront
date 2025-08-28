import {
  fetchAdminProduct,
  updateProductAction,
  updateProductImageAction,
} from "@/utils/actions"
import FormContainer from "@/components/form/FormContainer"
import FormInput from "@/components/form/FormInput"
import PriceInput from "@/components/form/PriceInput"
import TextAreaInput from "@/components/form/TextAreaInput"
import { SubmitButton } from "@/components/form/Buttons"
import CheckboxInput from "@/components/form/CheckBoxInput"
import { BsLink45Deg } from "react-icons/bs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ImageInputContainer from "@/components/form/ImageInputContainer"
import { integerCentsToCurrencyNumber } from "@/utils/format"

async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = await fetchAdminProduct(id)
  const { name, company, description, featured, price } = product
  const formattedPrice = integerCentsToCurrencyNumber(price)
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>update product</h1>
      <div className='border p-8 rounded-md'>
        <ImageInputContainer
          action={updateProductImageAction}
          name={name}
          image={product.image}
          text='Update Image'
        >
          <input type='hidden' name='id' value={id} />
          <input type='hidden' name='url' value={product.image} />
        </ImageInputContainer>
        <FormContainer
          action={updateProductAction}
          onSuccessRedirectTo='/admin/products/'
        >
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
            <PriceInput defaultValue={formattedPrice} />
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
          <div className='flex space-x-4 mt-8 items-center'>
            <SubmitButton text='update product' />
            <Link href={`/products/${id}`}>
              <Button size='icon' variant='secondary'>
                <BsLink45Deg />
              </Button>
            </Link>
          </div>
        </FormContainer>
      </div>
    </section>
  )
}
export default EditProductPage
