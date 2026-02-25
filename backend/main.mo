import Array "mo:core/Array";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type APRRange = {
    min : Float;
    max : Float;
  };

  module APRRange {
    public func compareByMaxAndMin(a : APRRange, b : APRRange) : Order.Order {
      let result = Float.compare(a.max, b.max);
      switch (result) {
        case (#greater) { #greater };
        case (#less) { #less };
        case (#equal) { Float.compare(a.min, b.min) };
      };
    };
  };

  type RewardsRate = {
    cashBack : ?Float;
    points : ?Float;
    miles : ?Float;
  };

  module RewardsRate {
    public func compareByRewardTypes(a : RewardsRate, b : RewardsRate) : Order.Order {
      let cashBackComparison = compareNullableFloats(a.cashBack, b.cashBack);
      switch (cashBackComparison) {
        case (#greater) { #greater };
        case (#less) { #less };
        case (#equal) {
          let pointsComparison = compareNullableFloats(a.points, b.points);
          switch (pointsComparison) {
            case (#greater) { #greater };
            case (#less) { #less };
            case (#equal) {
              compareNullableFloats(a.miles, b.miles);
            };
          };
        };
      };
    };

    func compareNullableFloats(a : ?Float, b : ?Float) : Order.Order {
      switch (a, b) {
        case (null, null) { #equal };
        case (null, _) { #less };
        case (_, null) { #greater };
        case (?valA, ?valB) { Float.compare(valA, valB) };
      };
    };
  };

  type CreditCard = {
    id : Nat;
    name : Text;
    issuer : Text;
    annualFee : Float;
    apr : APRRange;
    rewardsRate : RewardsRate;
    signupBonus : Text;
    categories : [Text];
    creditScoreRequired : Text;
    description : Text;
  };

  module CreditCard {
    public func compareByAnnualFee(a : CreditCard, b : CreditCard) : Order.Order {
      Float.compare(a.annualFee, b.annualFee);
    };

    public func compareByAPR(a : CreditCard, b : CreditCard) : Order.Order {
      APRRange.compareByMaxAndMin(a.apr, b.apr);
    };

    public func compareByRewardsRate(a : CreditCard, b : CreditCard) : Order.Order {
      RewardsRate.compareByRewardTypes(a.rewardsRate, b.rewardsRate);
    };
  };

  let creditCards = Map.empty<Nat, CreditCard>();

  public shared ({ caller }) func initialize() : async () {
    if (creditCards.size() > 0) {
      Runtime.trap("Data store already populated");
    };

    let sampleCards : [(Nat, CreditCard)] = [
      (
        1,
        {
          id = 1;
          name = "CashBackPlus";
          issuer = "Bank A";
          annualFee = 95.0;
          apr = { min = 14.99; max = 23.99 };
          rewardsRate = {
            cashBack = ?1.5;
            points = null;
            miles = null;
          };
          signupBonus = "Earn $200 after spending $1,000 in first 3 months";
          categories = ["cashback"];
          creditScoreRequired = "Good";
          description = "Great for everyday purchases with cashback rewards.";
        },
      ),
      (
        2,
        {
          id = 2;
          name = "TravelRewards Elite";
          issuer = "Bank B";
          annualFee = 250.0;
          apr = { min = 16.99; max = 24.99 };
          rewardsRate = {
            cashBack = ?1.0;
            points = ?5.0;
            miles = ?3.0;
          };
          signupBonus = "50,000 points after spending $3,000 within 3 months";
          categories = ["travel", "rewards"];
          creditScoreRequired = "Excellent";
          description = "Premium travel card with points and miles rewards.";
        },
      ),
      (
        3,
        {
          id = 3;
          name = "Student Saver";
          issuer = "Bank C";
          annualFee = 0.0;
          apr = { min = 18.0; max = 25.0 };
          rewardsRate = {
            cashBack = ?1.0;
            points = null;
            miles = null;
          };
          signupBonus = "No welcome bonus";
          categories = ["cashback", "student"];
          creditScoreRequired = "Fair";
          description = "Ideal for students building credit with rewards.";
        },
      ),
      (
        4,
        {
          id = 4;
          name = "Business Advantage Card";
          issuer = "Bank D";
          annualFee = 120.0;
          apr = { min = 15.5; max = 23.5 };
          rewardsRate = {
            cashBack = ?1.2;
            points = ?2.0;
            miles = null;
          };
          signupBonus = "Earn $300 after spending $3,000 in first 3 months";
          categories = ["business", "cashback"];
          creditScoreRequired = "Good";
          description = "Designed for business expenses with rewards benefits.";
        },
      ),
      (
        5,
        {
          id = 5;
          name = "Balance Transfer Platinum";
          issuer = "Bank E";
          annualFee = 0.0;
          apr = { min = 12.99; max = 21.99 };
          rewardsRate = {
            cashBack = ?1.0;
            points = null;
            miles = null;
          };
          signupBonus = "0% APR for 18 months on balance transfers";
          categories = ["balance transfer"];
          creditScoreRequired = "Good";
          description = "Perfect for consolidating debts with balance transfers.";
        },
      ),
      (
        6,
        {
          id = 6;
          name = "Premium Rewards Card";
          issuer = "Bank F";
          annualFee = 150.0;
          apr = { min = 15.99; max = 24.99 };
          rewardsRate = {
            cashBack = ?1.25;
            points = ?3.0;
            miles = null;
          };
          signupBonus = "30,000 points after $2,500 in purchases in first 3 months";
          categories = ["rewards"];
          creditScoreRequired = "Excellent";
          description = "Earn exclusive rewards on dining and entertainment.";
        },
      ),
      (
        7,
        {
          id = 7;
          name = "Everyday Cashback Card";
          issuer = "Bank G";
          annualFee = 0.0;
          apr = { min = 13.99; max = 22.99 };
          rewardsRate = {
            cashBack = ?2.0;
            points = null;
            miles = null;
          };
          signupBonus = "$150 cashback after $500 in first 3 months";
          categories = ["cashback"];
          creditScoreRequired = "Good";
          description = "Maximize cashback rewards on everyday expenses.";
        },
      ),
      (
        8,
        {
          id = 8;
          name = "Travel Explorer Card";
          issuer = "Bank H";
          annualFee = 200.0;
          apr = { min = 15.55; max = 23.55 };
          rewardsRate = {
            cashBack = ?1.0;
            points = ?4.0;
            miles = ?2.5;
          };
          signupBonus = "35,000 points after $3,500 in first 3 months";
          categories = ["travel", "rewards"];
          creditScoreRequired = "Excellent";
          description = "Perfect for travelers with high rewards rates.";
        },
      ),
    ];

    for ((id, card) in sampleCards.values()) {
      creditCards.add(id, card);
    };
  };

  public query ({ caller }) func getAllCards() : async [CreditCard] {
    creditCards.values().toArray();
  };

  public query ({ caller }) func getCardsByCategory(category : Text) : async [CreditCard] {
    creditCards.values().toArray().filter(
      func(card) {
        card.categories.findIndex(func(cat) { Text.equal(cat, category) }) != null;
      }
    );
  };

  public query ({ caller }) func getSortedCards(sortOption : Text) : async [CreditCard] {
    let cards = creditCards.values().toArray();
    switch (sortOption) {
      case ("annualFee") {
        return cards.sort(CreditCard.compareByAnnualFee);
      };
      case ("apr") {
        return cards.sort(CreditCard.compareByAPR);
      };
      case ("rewardsRate") {
        return cards.sort(CreditCard.compareByRewardsRate);
      };
      case (_) {
        Runtime.trap("Invalid sort option");
      };
    };
  };

  public query ({ caller }) func getAllCategories() : async [Text] {
    let uniqueCategories = creditCards.values().toArray().foldLeft(
      Map.empty<Text, Text>(),
      func(categoryMap, card) {
        card.categories.foldLeft(
          categoryMap,
          func(acc, category) {
            if (not acc.containsKey(category)) {
              acc.add(category, category);
            };
            acc;
          },
        );
      },
    );

    uniqueCategories.keys().toArray();
  };
};
