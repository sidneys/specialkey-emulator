/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Sidney Bofah
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
#import <IOKit/hidsystem/IOHIDLib.h>
#import <IOKit/hidsystem/ev_keymap.h>
#import <nan.h>


// Private
// Establish I/O gateway
static io_connect_t _getAuxiliaryKeyDriver(void)
{
    static mach_port_t sEventDrvrRef = 0;
    mach_port_t masterPort, service, iter;
    kern_return_t kr;

    if (!sEventDrvrRef)
    {
        kr = IOMasterPort( bootstrap_port, &masterPort );
        assert(KERN_SUCCESS == kr);

        kr = IOServiceGetMatchingServices(masterPort, IOServiceMatching( kIOHIDSystemClass), &iter );
        assert(KERN_SUCCESS == kr);

        service = IOIteratorNext( iter );
        assert(service);

        kr = IOServiceOpen(service, mach_task_self(), kIOHIDParamConnectType, &sEventDrvrRef );
        assert(KERN_SUCCESS == kr);

        IOObjectRelease(service);
        IOObjectRelease(iter);
    }
    return sEventDrvrRef;
}

// Private
// Post Key
static void _postAuxiliaryKey(const UInt8 auxKeyCode)
{
  NXEventData   event;
  kern_return_t kr;
  IOGPoint loc = { 0, 0 };

  // Key Down
  UInt32 evtInfo = auxKeyCode << 16 | NX_KEYDOWN << 8;
  bzero(&event, sizeof(NXEventData));
  event.compound.subType = NX_SUBTYPE_AUX_CONTROL_BUTTONS;
  event.compound.misc.L[0] = evtInfo;
  kr = IOHIDPostEvent( _getAuxiliaryKeyDriver(), NX_SYSDEFINED, loc, &event, kNXEventDataVersion, 0, FALSE );
  assert( KERN_SUCCESS == kr );

  // Key Up
  evtInfo = auxKeyCode << 16 | NX_KEYUP << 8;
  bzero(&event, sizeof(NXEventData));
  event.compound.subType = NX_SUBTYPE_AUX_CONTROL_BUTTONS;
  event.compound.misc.L[0] = evtInfo;
  kr = IOHIDPostEvent( _getAuxiliaryKeyDriver(), NX_SYSDEFINED, loc, &event, kNXEventDataVersion, 0, FALSE );
  assert( KERN_SUCCESS == kr );

}


// Public
// Emit IO Events by Keycode
NAN_METHOD(emit) {

  // Resolve key code
  const uint8_t keyCode = info[0]->NumberValue();

  // Emit Key
  _postAuxiliaryKey(keyCode);

  // Return
  info.GetReturnValue().Set(keyCode);
}


// Init
NAN_MODULE_INIT(Init) {
  NAN_EXPORT(target, emit); // as shorthand
}

// Export Node module
NODE_MODULE(mediakeyEmitter, Init)



