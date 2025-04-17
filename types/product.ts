export interface ProductProps {
    _id: string,
    title: string,
    description: string,
    price: number,
    totalStock: number,
    brand: string,
    image: string,
    category: string[],
    salePrice: number,
    createdAt: string,
    updatedAt: string,
}