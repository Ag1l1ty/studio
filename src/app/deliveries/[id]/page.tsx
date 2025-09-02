
import { getDeliveries } from "@/lib/data";
import DeliveryDetailsClientPage from "./delivery-details-client-page";

export async function generateStaticParams() {
    const deliveries = getDeliveries();
    return deliveries.map((delivery) => ({
        id: delivery.id,
    }));
}

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return <DeliveryDetailsClientPage id={id} />;
}
