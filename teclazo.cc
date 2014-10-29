#include <node.h>
#include <v8.h>

#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <string.h>

using namespace v8;

// obtiene un `char *` de un `v8::Value`
char utf8char(v8::Local<v8::Value> value) {
  char c = 0x00;
  if (value->IsString()) {
    v8::String::Utf8Value string(value);
    c = ((char *)(*string))[0];
  }
  return c;
}

Handle<Value> getTTY(const Arguments &args) {
  HandleScope scope;
  return scope.Close(String::New(ttyname(0)));
}

Handle<Value> Teclazo(const Arguments &args) {
  HandleScope scope;

  if (args.Length() < 1) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  // La tty
  char *ttyName;
  if (!args[1]->IsUndefined()) {
    String::Utf8Value utfStr(args[1]);
    ttyName = strdup((char*) *utfStr);
  } else {
    ttyName = ttyname(0);
  }

  // La tecla
  char *keys = (char *)malloc(2);
  if ((keys[0] = utf8char(args[0]))) {
    int tty = open(ttyName, O_RDWR);
    if (tty == -1) {
      ThrowException(Exception::TypeError(String::New("Can't open tty")));
    } else {
      usleep(5000);
      ioctl(tty, TIOCSTI, keys);
      close(tty);
    }
  }
  return scope.Close(Undefined());
}

void init(Handle<Object> exports, Handle<Object> module) {
  Local<Object> obj = Object::New();
  obj->Set(String::NewSymbol("write"),
    FunctionTemplate::New(Teclazo)->GetFunction());
  obj->Set(String::NewSymbol("tty"),
    FunctionTemplate::New(getTTY)->GetFunction());
  module->Set(String::NewSymbol("exports"),
    obj);
}

NODE_MODULE(teclazo, init);