import React from "react";
import {
  Star,
  Shield,
  Zap,
  ArrowRight,
  Crown,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import Razorpay from "razorpay";

const PlanFeature = ({ children }) => (
  <li className="flex items-center gap-2 py-2">
    <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
    <span className="text-gray-300 text-sm">{children}</span>
  </li>
);

const Premium = () => {
  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, currency, orderId, notes, key_id } = order.data;

      const options = {
        key: "rzp_test_vDOtBmhSsmFIlN",
        amount,
        currency,
        name: "Dev Tinder",
        description: "Buy Membership",
        order_id: orderId,
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
  

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("Payment failed. Please try again.");
      });
    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("Failed to create Razorpay order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700/50 mb-4">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">
              Limited Time Offer - Save 20%
            </span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Premium Experience
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Unlock the full potential of our platform with our premium plans
            designed for every need
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-2 gap-8 relative">
          {/* Silver Plan */}
          <div className="rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl hover:shadow-purple-500/10 transition-all duration-500 group p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">
                    <span className="bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
                      Silver Plan
                    </span>
                  </h2>
                </div>
                <Shield className="h-8 w-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$299</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>

              <div className="space-y-6 py-6">
                <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-purple-200">
                    Perfect for getting started
                  </span>
                </div>
                <ul className="space-y-2">
                  <PlanFeature>Chat with other peoples</PlanFeature>
                  <PlanFeature>100 Connection Request Per Day</PlanFeature>
                  <PlanFeature>Get a Blue Tick</PlanFeature>
                </ul>
              </div>

              <button
                onClick={() => {
                  handleBuyClick("silver");
                }}
                className="w-full  bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-12 text-lg flex items-center justify-center group transition-colors "
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Gold Plan */}
          <div className="rounded-lg bg-gradient-to-b from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 group p-6 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-5 right-5">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Crown className="h-4 w-4" />
                Most Popular
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Gold Plan
                    </span>
                  </h2>
                </div>
                <Crown className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$999</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>

              <div className="space-y-6 py-6">
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-yellow-200">
                    All features and exclusive benefits
                  </span>
                </div>
                <ul className="space-y-2">
                  <PlanFeature>Everything in Silver</PlanFeature>
                  <PlanFeature>Unlimited Chat</PlanFeature>
                  <PlanFeature>24/7 premium support</PlanFeature>
                  <PlanFeature>Unlimited Request Per Day</PlanFeature>
                  <PlanFeature>Early access to new features</PlanFeature>
                </ul>
              </div>

              <button
                onClick={() => {
                  handleBuyClick("gold");
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg h-12 text-lg flex items-center justify-center group transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
