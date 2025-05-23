module suistream::content {
    module suistream::content_access {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};

    // Error codes
    const EInsufficientFunds: u64 = 0;
    const ESubscriptionNotExpired: u64 = 1;
    const ESubscriptionExpired: u64 = 2;
    const EContentNotOwned: u64 = 3;

    // Events
    struct ContentPurchased has copy, drop {
        buyer: address,
        content_id: String,
        price: u64,
    }

    struct SubscriptionPurchased has copy, drop {
        buyer: address,
        duration_days: u64,
        price: u64,
        expires_at: u64,
    }

    // Content NFT representing ownership of a specific content
    struct ContentNFT has key, store {
        id: UID,
        content_id: String,
        owner: address,
        purchase_time: u64,
    }

    // Subscription representing access to all content for a period
    struct Subscription has key, store {
        id: UID,
        owner: address,
        start_time: u64,
        end_time: u64,
    }

    // Treasury to collect payments
    struct Treasury has key {
        id: UID,
        balance: u64,
    }

    // Initialize the module
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: 0,
        };
        transfer::share_object(treasury);
    }

    // Purchase content and receive an NFT
    public entry fun purchase_content(
        treasury: &mut Treasury,
        content_id: vector<u8>,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let content_id_str = string::utf8(content_id);
        let payment_amount = coin::value(&payment);
        
        // Add payment to treasury
        let coin_balance = coin::into_balance(payment);
        treasury.balance = treasury.balance + coin::value_of(&coin_balance);
        
        // Create content NFT
        let content_nft = ContentNFT {
            id: object::new(ctx),
            content_id: content_id_str,
            owner: tx_context::sender(ctx),
            purchase_time: clock::timestamp_ms(clock),
        };
        
        // Transfer NFT to buyer
        transfer::transfer(content_nft, tx_context::sender(ctx));
        
        // Emit event
        event::emit(ContentPurchased {
            buyer: tx_context::sender(ctx),
            content_id: content_id_str,
            price: payment_amount,
        });
    }

    // Purchase a subscription
    public entry fun purchase_subscription(
        treasury: &mut Treasury,
        payment: Coin<SUI>,
        duration_days: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let payment_amount = coin::value(&payment);
        
        // Add payment to treasury
        let coin_balance = coin::into_balance(payment);
        treasury.balance = treasury.balance + coin::value_of(&coin_balance);
        
        // Calculate end time (current time + duration in milliseconds)
        let start_time = clock::timestamp_ms(clock);
        let end_time = start_time + (duration_days * 24 * 60 * 60 * 1000);
        
        // Create subscription
        let subscription = Subscription {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            start_time,
            end_time,
        };
        
        // Transfer subscription to buyer
        transfer::transfer(subscription, tx_context::sender(ctx));
        
        // Emit event
        event::emit(SubscriptionPurchased {
            buyer: tx_context::sender(ctx),
            duration_days,
            price: payment_amount,
            expires_at: end_time,
        });
    }

    // Check if user owns content
    public fun is_content_owned(
        content_id: String,
        owner: address,
        ctx: &TxContext
    ): bool {
        // In a real implementation, this would query the blockchain
        // For simplicity, we'll return true if the sender is the owner
        tx_context::sender(ctx) == owner
    }

    // Check if user has an active subscription
    public fun has_active_subscription(
        subscription: &Subscription,
        clock: &Clock
    ): bool {
        clock::timestamp_ms(clock) <= subscription.end_time
    }
}

    /// Create a Reviews object
    public entry fun create_reviews(ctx: &mut TxContext): Reviews {
        let id = object::new(ctx);
        let table = Table::new(ctx);
        let reviews = Reviews { id, table };
        transfer::share_object(reviews);
        reviews
    }

    /// Create a UserLibrary object for a user
    public entry fun create_user_library(ctx: &mut TxContext): UserLibrary {
        let id = object::new(ctx);
        let owner = tx_context::sender(ctx);
        let content_ids = vector::empty<String>();
        let lib = UserLibrary { id, owner, content_ids };
        transfer::share_object(lib);
        lib
    }

    /// Create a Watchlist object for a user
    public entry fun create_watchlist(ctx: &mut TxContext): Watchlist {
        let id = object::new(ctx);
        let items = vector::empty<String>();
        let wl = Watchlist { id, items };
        transfer::share_object(wl);
        wl
    }

    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::vector;
    use std::option;
    use sui::table::{Self, Table};

    // --- Watchlist and Reviews ---
    struct Watchlist has key {
        id: UID,
        items: vector<String>,
    }
    struct Review has store, drop, copy {
        reviewer: address,
        content_id: String,
        text: String,
    }
    struct Reviews has key {
        id: UID,
        // content_id => vector<Review>
        table: Table<String, vector<Review>>,
    }
    struct UserLibrary has key {
        id: UID,
        owner: address,
        content_ids: vector<String>,
    }

    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::vector;
    
    // Error codes
    const EInsufficientFunds: u64 = 0;
    const ESubscriptionNotActive: u64 = 1;
    const ENotOwner: u64 = 2;
    const EInvalidDuration: u64 = 3;
    
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
        balance: u64,
        admin: address,
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
    
    // Initialize the module
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: 0,
            admin: tx_context::sender(ctx),
        };
        
        transfer::share_object(treasury);
    }
    
    // Purchase content as an NFT
    public entry fun purchase_content(
        treasury: &mut Treasury,
        content_id: vector<u8>,
        content_type: vector<u8>,
        title: vector<u8>,
        metadata: vector<u8>,
        payment: &mut Coin<SUI>,
        price: u64,
        clock: &Clock,
        ctx: &mut TxContext,
        user_library: &mut UserLibrary,
    ) {
        // Ensure sufficient funds
        assert!(coin::value(payment) >= price, EInsufficientFunds);
        
        // Transfer payment to treasury
        let paid = coin::split(payment, price, ctx);
        treasury.balance = treasury.balance + price;
        coin::destroy_zero(paid);
        
        // Create content NFT
        let content_nft = ContentNFT {
            id: object::new(ctx),
            content_id: string::utf8(content_id),
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
        
        // Transfer NFT to buyer
        transfer::transfer(content_nft, tx_context::sender(ctx));
        // Add to user library
        vector::push_back(&mut user_library.content_ids, content_nft.content_id);
    }
    
    // Create or renew a subscription
    public entry fun create_subscription(
        treasury: &mut Treasury,
        plan: vector<u8>,
        duration_days: u64,
        payment: &mut Coin<SUI>,
        price: u64,
        auto_renew: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate duration
        assert!(duration_days == 30 || duration_days == 365, EInvalidDuration);
        
        // Ensure sufficient funds
        assert!(coin::value(payment) >= price, EInsufficientFunds);
        
        // Transfer payment to treasury
        let paid = coin::split(payment, price, ctx);
        treasury.balance = treasury.balance + price;
        coin::destroy_zero(paid);
        
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
        payment: &mut Coin<SUI>,
        price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Ensure the caller is the subscriber
        assert!(subscription.subscriber == tx_context::sender(ctx), ENotOwner);
        
        // Ensure sufficient funds
        assert!(coin::value(payment) >= price, EInsufficientFunds);
        
        // Transfer payment to treasury
        let paid = coin::split(payment, price, ctx);
        treasury.balance = treasury.balance + price;
        coin::destroy_zero(paid);
        
        // Calculate new end time (30 days from current end time or now if expired)
        let current_time = clock::timestamp_ms(clock);
        let new_start_time = if (subscription.end_time > current_time) {
            subscription.end_time
        } else {
            current_time
        };
        
        // Determine duration based on plan
        let duration_days = if (string::index_of(&subscription.plan, &string::utf8(b"annual")) == 0) {
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
    
    // Check if a subscription is active
    public fun is_subscription_active(subscription: &Subscription, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock);
        current_time <= subscription.end_time
    }
    
    // Check if a user owns a specific content
    public fun owns_content(content_nft: &ContentNFT, user: address): bool {
        content_nft.owner == user
    }
    // Get all owned content for a wallet
    public fun get_owned_content(user_library: &UserLibrary): vector<String> {
        user_library.content_ids
    }
    // --- Watchlist ---
    public entry fun add_to_watchlist(watchlist: &mut Watchlist, content_id: String) {
        if (!vector::contains(&watchlist.items, &content_id)) {
            vector::push_back(&mut watchlist.items, content_id);
        }
    }
    public entry fun remove_from_watchlist(watchlist: &mut Watchlist, content_id: String) {
        let mut i = 0u64;
        while (i < vector::length(&watchlist.items)) {
            if (vector::borrow(&watchlist.items, i) == &content_id) {
                vector::remove(&mut watchlist.items, i);
                break;
            };
            i = i + 1;
        }
    }
    public fun get_watchlist(watchlist: &Watchlist): vector<String> {
        watchlist.items
    }
    // --- Reviews ---
    public entry fun add_review(reviews: &mut Reviews, content_id: String, reviewer: address, text: String) {
        let review = Review { reviewer, content_id: content_id.clone(), text };
        let existing = Table::borrow_mut(&mut reviews.table, &content_id);
        match existing {
            option::Some(mut vec) => { vector::push_back(&mut vec, review); },
            option::None => { Table::insert(&mut reviews.table, content_id, vector::singleton(review)); }
        }
    }
    public fun get_reviews(reviews: &Reviews, content_id: String): vector<Review> {
        let option_vec = Table::borrow(&reviews.table, &content_id);
        match option_vec {
            option::Some(vec) => vec,
            option::None => vector::empty<Review>(),
        }
    }
    
    // Get subscription details
    public fun get_subscription_details(subscription: &Subscription): (address, String, u64, u64, bool) {
        (
            subscription.subscriber,
            subscription.plan,
            subscription.start_time,
            subscription.end_time,
            subscription.auto_renew
        )
    }
    
    // Get content details
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
        assert!(treasury.balance >= amount, EInsufficientFunds);
        
        // Decrease treasury balance
        treasury.balance = treasury.balance - amount;
        
        // Create coin and transfer to admin
        let coin = coin::mint_for_testing<SUI>(amount, ctx);
        transfer::transfer(coin, treasury.admin);
    }
}
