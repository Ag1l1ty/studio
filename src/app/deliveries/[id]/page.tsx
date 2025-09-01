
import DeliveryDetailsClientPage from "./delivery-details-client-page";

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return <DeliveryDetailsClientPage id={id} />;
}
