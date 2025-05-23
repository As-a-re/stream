module suistream::content {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::balance::{Self, Balance};
    use std::string::{Self, String};
    use std::vector;
    use std::option::{Self, Option};

    // Error codes
    const EInsufficientFunds: u64 = 0;
    const ESubscriptionNotActive: u64 = 1;
    const ENotOwner: u64 = 2;
    const EInvalidDuration: u64 = 3;
    const EContentNotFound: u64 = 4;
    const EAlreadyInWatchlist: u64 = 5;

    // Content NFT representing ownership of a movie or TV show
    struct ContentNFT has key, store {
        id: UID,
        content_id: String,
        content_type: String, // "movie" or "tv"
        title: String,
        owner: address,
        purchase_time: u64,
        metadata: String, // JSON string with additional metadata
    }

    // Subscription representing access to the streaming platform
    struct Subscription has key, store {
        id: UID,
        subscriber: address,
        plan: String, // "basic", "standard", "premium"
        start_time: u64,
        end_time: u64,
        auto_renew: bool,
    }

    // Treasury to collect payments
    struct Treasury has key {
        id: UID,
        balance: Balance<SUI>,
        admin: address,
    }

    // Watchlist for users
    struct Watchlist has key {
        id: UID,
        owner: address,
        items: vector<String>,
    }

    // Review structure
    struct Review has store, drop, copy {
        reviewer: address,
        content_id: String,
        text: String,
        timestamp: u64,
    }

    // Reviews collection
    struct Reviews has key {
        id: UID,
        table: Table<String, vector<Review>>,
    }

    // User Library
    struct UserLibrary has key {
        id: UID,
        owner: address,
        content_ids: vector<String>,
    }

    // Events
    struct ContentPurchased has copy, drop {
        content_id: String,
        content_type: String,
        buyer: address,
        price: u64,
        purchase_time: u64,
    }

    struct SubscriptionCreated has copy, drop {
        subscriber: address,
        plan: String,
        start_time: u64,
        end_time: u64,
        price: u64,
    }

    struct SubscriptionRenewed has copy, drop {
        subscriber: address,
        plan: String,
        start_time: u64,
        end_time: u64,
        price: u64,
    }

    struct ReviewAdded has copy, drop {
        content_id: String,
        reviewer: address,
        timestamp: u64,
    }

    // Initialize the module
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
            admin: tx_context::sender(ctx),
        };
        
        transfer::share_object(treasury);
    }

    // Create a Reviews object
    public entry fun create_reviews(ctx: &mut TxContext) {
        let reviews = Reviews {
            id: object::new(ctx),
            table: table::new(ctx),
        };
        transfer::share_object(reviews);
    }

    // Create a UserLibrary object for a user
    public entry fun create_user_library(ctx: &mut TxContext) {
        let lib = UserLibrary {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            content_ids: vector::empty<String>(),
        };
        transfer::transfer(lib, tx_context::sender(ctx));
    }

    // Create a Watchlist object for a user
    public entry fun create_watchlist(ctx: &mut TxContext) {
        let wl = Watchlist {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            items: vector::empty<String>(),
        };
        transfer::transfer(wl, tx_context::sender(ctx));
    }

    // Purchase content as an NFT
    public entry fun purchase_content(
        treasury: &mut Treasury,
        content_id: vector<u8>,
        content_type: vector<u8>,
        title: vector<u8>,
        metadata: vector<u8>,
        payment: Coin<SUI>,
        price: u64,
        clock: &Clock,
        user_library: &mut UserLibrary,
        ctx: &mut TxContext
    ) {
        // Ensure sufficient funds
        assert!(coin::value(&payment) >= price, EInsufficientFunds);
        
        // Ensure caller owns the library
        assert!(user_library.owner == tx_context::sender(ctx), ENotOwner);
        
        // Split payment and add to treasury
        let payment_balance = coin::into_balance(payment);
        let treasury_payment = balance::split(&mut payment_balance, price);
        balance::join(&mut treasury.balance, treasury_payment);
        
        // Handle any remaining balance
        if (balance::value(&payment_balance) > 0) {
            let remaining_coin = coin::from_balance(payment_balance, ctx);
            transfer::public_transfer(remaining_coin, tx_context::sender(ctx));
        } else {
            balance::destroy_zero(payment_balance);
        };
        
        let content_id_str = string::utf8(content_id);
        
        // Create content NFT
        let content_nft = ContentNFT {
            id: object::new(ctx),
            content_id: content_id_str,
            content_type: string::utf8(content_type),
            title: string::utf8(title),
            owner: tx_context::sender(ctx),
            purchase_time: clock::timestamp_ms(clock),
            metadata: string::utf8(metadata),
        };
        
        // Emit event
        event::emit(ContentPurchased {
            content_id: content_nft.content_id,
            content_type: content_nft.content_type,
            buyer: content_nft.owner,
            price,
            purchase_time: content_nft.purchase_time,
        });
        
        // Add to user library
        vector::push_back(&mut user_library.content_ids, content_nft.content_id);
        
        // Transfer NFT to buyer
        transfer::transfer(content_nft, tx_context::sender(ctx));
    }

    // Create or renew a subscription
    public entry fun create_subscription(
        treasury: &mut Treasury,
        plan: vector<u8>,
        duration_days: u64,
        payment: Coin<SUI>,
        price: u64,
        auto_renew: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate duration
        assert!(duration_days == 30 || duration_days == 365, EInvalidDuration);
        
        // Ensure sufficient funds
        assert!(coin::value(&payment) >= price, EInsufficientFunds);
        
        // Split payment and add to treasury
        let payment_balance = coin::into_balance(payment);
        let treasury_payment = balance::split(&mut payment_balance, price);
        balance::join(&mut treasury.balance, treasury_payment);
        
        // Handle any remaining balance
        if (balance::value(&payment_balance) > 0) {
            let remaining_coin = coin::from_balance(payment_balance, ctx);
            transfer::public_transfer(remaining_coin, tx_context::sender(ctx));
        } else {
            balance::destroy_zero(payment_balance);
        };
        
        let current_time = clock::timestamp_ms(clock);
        let end_time = current_time + (duration_days * 24 * 60 * 60 * 1000);
        
        // Create subscription
        let subscription = Subscription {
            id: object::new(ctx),
            subscriber: tx_context::sender(ctx),
            plan: string::utf8(plan),
            start_time: current_time,
            end_time,
            auto_renew,
        };
        
        // Emit event
        event::emit(SubscriptionCreated {
            subscriber: subscription.subscriber,
            plan: subscription.plan,
            start_time: subscription.start_time,
            end_time: subscription.end_time,
            price,
        });
        
        // Transfer subscription to subscriber
        transfer::transfer(subscription, tx_context::sender(ctx));
    }

    // Renew an existing subscription
    public entry fun renew_subscription(
        treasury: &mut Treasury,
        subscription: &mut Subscription,
        payment: Coin<SUI>,
        price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Ensure the caller is the subscriber
        assert!(subscription.subscriber == tx_context::sender(ctx), ENotOwner);
        
        // Ensure sufficient funds
        assert!(coin::value(&payment) >= price, EInsufficientFunds);
        
        // Split payment and add to treasury
        let payment_balance = coin::into_balance(payment);
        let treasury_payment = balance::split(&mut payment_balance, price);
        balance::join(&mut treasury.balance, treasury_payment);
        
        // Handle any remaining balance
        if (balance::value(&payment_balance) > 0) {
            let remaining_coin = coin::from_balance(payment_balance, ctx);
            transfer::public_transfer(remaining_coin, tx_context::sender(ctx));
        } else {
            balance::destroy_zero(payment_balance);
        };
        
        // Calculate new end time
        let current_time = clock::timestamp_ms(clock);
        let new_start_time = if (subscription.end_time > current_time) {
            subscription.end_time
        } else {
            current_time
        };
        
        // Determine duration based on plan
        let duration_days = if (string::bytes(&subscription.plan) == b"annual") {
            365
        } else {
            30
        };
        
        let new_end_time = new_start_time + (duration_days * 24 * 60 * 60 * 1000);
        
        // Update subscription
        subscription.start_time = new_start_time;
        subscription.end_time = new_end_time;
        
        // Emit event
        event::emit(SubscriptionRenewed {
            subscriber: subscription.subscriber,
            plan: subscription.plan,
            start_time: subscription.start_time,
            end_time: subscription.end_time,
            price,
        });
    }

    // Watchlist functions
    public entry fun add_to_watchlist(watchlist: &mut Watchlist, content_id: String, ctx: &TxContext) {
        assert!(watchlist.owner == tx_context::sender(ctx), ENotOwner);
        assert!(!vector::contains(&watchlist.items, &content_id), EAlreadyInWatchlist);
        vector::push_back(&mut watchlist.items, content_id);
    }

    public entry fun remove_from_watchlist(watchlist: &mut Watchlist, content_id: String, ctx: &TxContext) {
        assert!(watchlist.owner == tx_context::sender(ctx), ENotOwner);
        let (exists, index) = vector::index_of(&watchlist.items, &content_id);
        if (exists) {
            vector::remove(&mut watchlist.items, index);
        };
    }

    // Reviews functions
    public entry fun add_review(
        reviews: &mut Reviews, 
        content_id: String, 
        text: String,
        clock: &Clock,
        ctx: &TxContext
    ) {
        let review = Review { 
            reviewer: tx_context::sender(ctx), 
            content_id, 
            text,
            timestamp: clock::timestamp_ms(clock),
        };
        
        if (table::contains(&reviews.table, content_id)) {
            let existing_reviews = table::borrow_mut(&mut reviews.table, content_id);
            vector::push_back(existing_reviews, review);
        } else {
            table::add(&mut reviews.table, content_id, vector::singleton(review));
        };
        
        event::emit(ReviewAdded {
            content_id,
            reviewer: tx_context::sender(ctx),
            timestamp: review.timestamp,
        });
    }

    // View functions
    public fun is_subscription_active(subscription: &Subscription, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock);
        current_time <= subscription.end_time
    }

    public fun owns_content(content_nft: &ContentNFT, user: address): bool {
        content_nft.owner == user
    }

    public fun get_owned_content(user_library: &UserLibrary): vector<String> {
        user_library.content_ids
    }

    public fun get_watchlist(watchlist: &Watchlist): vector<String> {
        watchlist.items
    }

    public fun get_reviews(reviews: &Reviews, content_id: String): vector<Review> {
        if (table::contains(&reviews.table, content_id)) {
            *table::borrow(&reviews.table, content_id)
        } else {
            vector::empty<Review>()
        }
    }

    public fun get_subscription_details(subscription: &Subscription): (address, String, u64, u64, bool) {
        (
            subscription.subscriber,
            subscription.plan,
            subscription.start_time,
            subscription.end_time,
            subscription.auto_renew
        )
    }

    public fun get_content_details(content_nft: &ContentNFT): (String, String, String, address, u64) {
        (
            content_nft.content_id,
            content_nft.content_type,
            content_nft.title,
            content_nft.owner,
            content_nft.purchase_time
        )
    }

    // Admin function to withdraw funds from treasury
    public entry fun withdraw_funds(
        treasury: &mut Treasury,
        amount: u64,
        ctx: &mut TxContext
    ) {
        // Ensure caller is admin
        assert!(treasury.admin == tx_context::sender(ctx), ENotOwner);
        
        // Ensure sufficient funds in treasury
        assert!(balance::value(&treasury.balance) >= amount, EInsufficientFunds);
        
        // Split balance and create coin
        let withdrawal_balance = balance::split(&mut treasury.balance, amount);
        let coin = coin::from_balance(withdrawal_balance, ctx);
        transfer::public_transfer(coin, treasury.admin);
    }

    public fun get_treasury_balance(treasury: &Treasury): u64 {
        balance::value(&treasury.balance)
    }
}
