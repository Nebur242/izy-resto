import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Home, Star, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useOrders } from '../context/OrderContext';
import { OrderTrackingDetails } from '../components/orders/tracking/OrderTrackingDetails';
import { OrderTrackingHeader } from '../components/orders/tracking/OrderTrackingHeader';
import { OrderTrackingTimeline } from '../components/orders/tracking/OrderTrackingTimeline';
import { OrderRating } from '../components/orders/rating/OrderRating';
import { orderService } from '../services/orders/order.service';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function OrderTracking() {
  const { t } = useTranslation('order');
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, isLoading } = useOrders();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = orderId ? getOrderById(orderId) : undefined;

  const handleSubmitRating = async () => {
    if (!orderId || rating === 0) return;

    try {
      setIsSubmitting(true);
      await orderService.updateOrderRating(orderId, rating, feedback);
      toast.success(t('common:thank-you-for-your-opinion'));
    } catch (error: any) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">{t('order-not-exist')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          {t('this-order-no-longer-exist')}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common:back')}
          </Button>
          <Link to="/">
            <Button variant="secondary">
              <Home className="w-4 h-4 mr-2" />
              {t('common:home')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common:back')}
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">
              <Home className="w-4 h-4 mr-2" />
              {t('common:home')}
            </Button>
          </Link>
        </div>
        <div className="space-y-6">
          <div>
            <div
              className={`p-6 text-white rounded-t-2xl shadow-xl overflow-hidden ${
                order.status === 'cancelled'
                  ? 'bg-red-600'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  {order.status === 'cancelled' ? (
                    <XCircle className="w-8 h-8" />
                  ) : (
                    <CheckCircle className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {order.status === 'cancelled'
                      ? t('order:order-cancelled')
                      : t('order-confirmed')}
                  </h1>
                  <p className="text-white/80">
                    {order.status === 'cancelled'
                      ? t('this-order-is-canceled')
                      : t('order-successfully-saved')}
                  </p>
                </div>
              </div>
            </div>
            <OrderTrackingHeader order={order} />
          </div>

          <OrderTrackingTimeline order={order} />

          <OrderTrackingDetails order={order} />

          {(order.status === 'delivered' || order.status === 'cancelled') &&
            !order.rating && (
              <OrderRating
                rating={rating}
                onRatingChange={setRating}
                feedback={feedback}
                onFeedbackChange={setFeedback}
                onSubmit={handleSubmitRating}
                isSubmitting={isSubmitting}
              />
            )}

          {/* Show rating if exists */}
          {order.rating && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Votre avis</h3>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= order?.rating?.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              {order.rating.feedback && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {order.rating.feedback}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
