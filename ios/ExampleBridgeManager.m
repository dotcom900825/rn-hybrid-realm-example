//  Created by react-native-create-bridge

#import "ExampleBridge.h"
#import <Realm/Realm.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

@interface Car : RLMObject
@property NSString *make;
@property NSString *model;
@property NSInteger miles;
@end

@implementation Car
  + (NSDictionary *)defaultPropertyValues {
    return @{@"miles" : @0};
  }

+ (NSArray *)requiredProperties {
  return @[@"make", @"model"];
}
@end

RLM_ARRAY_TYPE(Car)

@interface Person : RLMObject
@property NSString      *name;
@property NSDate *birthday;
@property RLMArray<Car> *cars;
@property RLMArray<RLMString> *options;
@property RLMArray<RLMDate> *dates;
@property NSData *picture;
@end

@implementation Person
+ (NSArray *)requiredProperties {
  return @[@"name", @"birthday", @"options", @"dates"];
}
@end

@implementation ExampleBridge
@synthesize bridge = _bridge;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

// Export constants
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#exporting-constants
- (NSDictionary *)constantsToExport
{
  return @{
           @"EXAMPLE": @"example"
         };
}

// Return the native view that represents your React component
- (UIView *)view
{
  return [[UIView alloc] init];
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_METHOD(exampleMethod)
{
  RLMRealm *realm = [RLMRealm defaultRealm];
  
  [realm transactionWithBlock:^{
    [realm addObject:[[Person alloc] initWithValue:@{@"name" : @"test", @"birthday" : [NSDate dateWithTimeIntervalSinceNow:100], @"options" : @[@"123", @"456"]}]];
  }];
}

#pragma mark - Private methods

// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self.bridge.eventDispatcher sendAppEventWithName: eventName body: params];
}

@end
